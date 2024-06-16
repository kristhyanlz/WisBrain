import sqlite3

from flask import Flask, jsonify, request, g
from flask_cors import CORS, cross_origin
from threading import Thread

from WisBrain_Back.service.Arduino import Arduino
from WisBrain_Back.service.Validador import Validador
from WisBrain_Back.service.Tarjetas import Tarjetas
from WisBrain_Back.bd.ValidadorEntradaDB import ValidadorEntradaDB
from WisBrain_Back.service.Util import obtenerFechaActual

from WisBrain_Back.service.TecladoListener import TecladoListener

#import logging

#python -m flask run

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

#log = logging.getLogger('werkzeug')
#log.setLevel(logging.ERROR)

# Inicializar la clase Arduino, Tarjetas y Validador
# arduino = Arduino('COM5')
tarjetas = Tarjetas()
validadorEntrada = ValidadorEntradaDB()
validador = Validador(tarjetas)
teclado_listener = TecladoListener(validador)
resultado = []

app.config['DATABASE'] = 'WisBrain_Back/bd/database_wb.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(app.config['DATABASE'])
        db.execute("PRAGMA foreign_keys = ON;")
    return db


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


# Método para iniciar el escucha de datos del Arduino
def iniciar_escucha():
    #global arduino
    global teclado_listener
    #arduino.recibir_datos_continuamente(validador)
    teclado_listener.escuchar_teclado()


# Iniciar el escucha en un hilo separado
escucha_thread = Thread(target=iniciar_escucha)
escucha_thread.start()


@app.route('/', methods=['GET'])
@cross_origin()
def hello_world():
    return 'Hello Wis!'


@app.route('/getUpdate', methods=['GET'])
@cross_origin()
def get_update():
    #global arduino, resultado
    global resultado, teclado_listener
    #resultado = arduino.resultados_validacion
    resultado = teclado_listener.resultados_validacion
    # Devuelve la lista completa de resultados
    return jsonify(resultado)


# Podria ser a al revez.
@app.route('/resume', methods=['GET'])
@cross_origin()
def resume():
    #global arduino
    global teclado_listener
    teclado_listener.lock = True
    return jsonify({"mensaje": "se renaudo la deteccion"})


@app.route('/insertarPaciente', methods=['POST'])
def insertar_paciente():
    try:
        db = get_db()
        cursor = db.cursor()

        data = request.get_json()
        dni_paciente = data.get('dni_paciente')
        primer_nombre = data.get('primer_nombre')
        segundo_nombre = data.get('segundo_nombre')
        ape_paterno = data.get('ape_paterno')
        ape_materno = data.get('ape_materno')
        fecha_nacimiento = data.get('fecha_nacimiento')
        genero = data.get('genero')

        cursor.execute("""
            INSERT INTO paciente (dni_paciente, primer_nombre, segundo_nombre, ape_paterno, ape_materno, fecha_nacimiento, genero)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (dni_paciente, primer_nombre, segundo_nombre, ape_paterno, ape_materno, fecha_nacimiento, genero))

        db.commit()
        cursor.close()

        return jsonify({'message': 'Paciente insertado correctamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/obtenerFechaActual', methods=['GET'])
@cross_origin()
def obtenerFechaActual():
    result = obtenerFechaActual()
    return jsonify({'fechaActual': result})


@app.route('/insertarHistorial', methods=['POST'])
@cross_origin()
def insertarHistorial():
    try:
        db = get_db()
        cursor = db.cursor()

        data = request.get_json()
        dni_paciente = data.get('dni_paciente')
        num_cat_correctas = data.get('num_cat_correctas')
        num_err_perseverativos = data.get('num_err_perseverativos')
        num_err_no_perseverativos = data.get('num_err_no_perseverativos')
        num_total_errores = data.get('num_total_errores')
        procentaje_errores_perseverativos = data.get('procentaje_errores_perseverativos')
        observaciones = data.get('observaciones')
        fecha_test = data.get('fecha_test')
        resultado_test = data.get('resultado_test')

        cursor.execute("""
            INSERT INTO historial_test (id_historial, num_cat_correctas, num_err_perseverativos, num_err_no_perseverativos, 
                                       num_total_errores, procentaje_errores_perseverativos, observaciones, fecha_test, resultado_test)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        """, (dni_paciente, num_cat_correctas, num_err_perseverativos, num_err_no_perseverativos, num_total_errores,
              procentaje_errores_perseverativos, observaciones, fecha_test, resultado_test))

        db.commit()
        cursor.close()

        return jsonify({'message': 'Historial insertado correctamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/insertarMovimientos', methods=['POST'])
@cross_origin()
def insertarMovimientos():
    try:
        db = get_db()
        cursor = db.cursor()

        data = request.get_json()
        movimientos = data.get('movimientos', [])

        if not movimientos:
            return jsonify({'error': 'Lista de movimientos vacía'}), 400

        for movimiento in movimientos:
            numero_tarjeta = movimiento.get('numero_tarjeta')
            resultado = movimiento.get('resultado')
            categoria_esperada_id = movimiento.get('categoria_esperada_id')
            categoria_propuesta_id = movimiento.get('categoria_propuesta_id')
            id_historial = movimiento.get('id_historial')

            cursor.execute("""
                INSERT INTO movimiento (numero_tarjeta, resultado, categoria_esperada_id, categoria_propuesta_id, id_historial)
                VALUES (?, ?, ?, ?, ?);
            """, (numero_tarjeta, resultado, categoria_esperada_id, categoria_propuesta_id, id_historial))

        db.commit()
        cursor.close()

        return jsonify({'message': 'Movimientos insertados correctamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/devolverHistorialTestPacientes/<dni_paciente>', methods=['GET'])
@cross_origin()
def devolverHistorialTestPacientes(dni_paciente):
    try:
        db = get_db()
        cursor = db.cursor()

        cursor.execute("SELECT * FROM historial_test WHERE id_historial = ?;", (dni_paciente,))
        historial_tests = cursor.fetchall()

        cursor.close()

        return jsonify(historial_tests), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/eliminarHistorialPaciente/<dni_paciente>', methods=['DELETE'])
@cross_origin()
def eliminarHistorialPaciente(dni_paciente):
    try:
        db = get_db()
        cursor = db.cursor()

        # Eliminar movimientos asociados al paciente
        cursor.execute("DELETE FROM movimiento WHERE id_historial = ?;", (dni_paciente,))

        # Eliminar historial del paciente
        cursor.execute("DELETE FROM historial_test WHERE id_historial = ?;", (dni_paciente,))

        # Eliminar al paciente
        cursor.execute("DELETE FROM paciente WHERE dni_paciente = ?;", (dni_paciente,))

        db.commit()
        cursor.close()

        return jsonify({'message': 'Historial del paciente eliminado correctamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/devolverDatosPaciente/<dni_paciente>', methods=['GET'])
@cross_origin()
def devolverDatosPaciente(dni_paciente):
    try:
        db = get_db()
        cursor = db.cursor()

        cursor.execute("SELECT * FROM paciente WHERE dni_paciente = ?;", (dni_paciente,))
        datos_paciente = cursor.fetchone()

        cursor.close()

        if datos_paciente:
            return jsonify(datos_paciente), 200
        else:
            return jsonify({'error': 'Paciente no encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/actualizarPaciente', methods=['PUT'])
@cross_origin()
def actualizarPaciente():
    try:
        data = request.get_json()
        dni_paciente_antiguo = data.get('dni_paciente_antiguo')
        dni_paciente_nuevo = data.get('dni_paciente_nuevo')
        primer_nombre = data.get('primer_nombre')
        segundo_nombre = data.get('segundo_nombre')
        ape_paterno = data.get('ape_paterno')
        ape_materno = data.get('ape_materno')
        fecha_nacimiento = data.get('fecha_nacimiento')
        genero = data.get('genero')

        db = get_db()
        cursor = db.cursor()

        # Inicia la transacción
        cursor.execute("BEGIN TRANSACTION;")

        # Actualiza el paciente en la tabla paciente
        cursor.execute("""
            UPDATE paciente
            SET dni_paciente = ?, primer_nombre = ?, segundo_nombre = ?, ape_paterno = ?, ape_materno = ?, fecha_nacimiento = ?, genero = ?
            WHERE dni_paciente = ?;
        """, (dni_paciente_nuevo, primer_nombre, segundo_nombre, ape_paterno, ape_materno, fecha_nacimiento, genero, dni_paciente_antiguo))

        # Si el DNI es diferente, actualiza las tablas relacionadas
        if dni_paciente_antiguo != dni_paciente_nuevo:
            # Actualiza el paciente en la tabla historial_test
            cursor.execute("""
                UPDATE historial_test
                SET id_historial = ?
                WHERE id_historial = ?;
            """, (dni_paciente_nuevo, dni_paciente_antiguo))

            # Actualiza el paciente en la tabla movimiento
            cursor.execute("""
                UPDATE movimiento
                SET id_historial = ?
                WHERE id_historial = ?;
            """, (dni_paciente_nuevo, dni_paciente_antiguo))

        # Finaliza la transacción
        db.commit()
        cursor.close()

        return jsonify({'message': 'Paciente actualizado correctamente'}), 200
    except Exception as e:
        print(f"Error al actualizar paciente: {e}")
        # Revierte la transacción en caso de error
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
