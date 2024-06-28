import sqlite3
import threading

from flask import Flask, jsonify, request, g
from flask_cors import CORS, cross_origin
from threading import Thread
import simpleaudio as sa

import sys
from pathlib import Path

path = Path().absolute()
sys.path.append(str(path))

from WisBrain_Back.service.Arduino import Arduino
from WisBrain_Back.service.Validador import Validador
from WisBrain_Back.service.Tarjetas import Tarjetas
from WisBrain_Back.bd.ValidadorEntradaDB import ValidadorEntradaDB
from WisBrain_Back.service.Util import obtenerFechaActual

from WisBrain_Back.service.TecladoListener import TecladoListener

import logging

#python -m flask run
#python -m flask --app ./WisBrain_Back/api/app.py run
#sudo apt-get install -y python3-dev libasound2-dev

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

#/log = logging.getLogger('werkzeug')
#log.setLevel(logging.ERROR)

# Inicializar las variables
# arduino = Arduino('COM5')
'''
validadorEntrada = ValidadorEntradaDB()
validador = Validador(tarjetas)
teclado_listener = TecladoListener(validador)
resultado = []'''

tarjetas = Tarjetas()
arduino = None
validador = None
#teclado_listener = None
resultado = []
escucha_thread = None
audioSiguiente = sa.WaveObject.from_wave_file("WisBrain_Back/assets/siguiente.wav")


def reproducir_audio():
    play_obj = audioSiguiente.play()
    play_obj.wait_done()


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
    global arduino
    #global teclado_listener
    arduino.recibir_datos_continuamente(validador)
    #teclado_listener.escuchar_teclado()


# Iniciar el escucha en un hilo separado
#escucha_thread = Thread(target=iniciar_escucha)
#escucha_thread.start()


@app.route('/', methods=['GET'])
@cross_origin()
def hello_world():
    return 'Hello Wis!'


@app.route('/iniciar_test', methods=['GET'])
@cross_origin()
def iniciar_test():

    return iniciarTest()


def iniciarTest():
    # global teclado_listener
    global arduino
    global validador, resultado, escucha_thread

    # Inicializar las variables globales
    arduino = Arduino('/dev/pts/8')
    validador = Validador(tarjetas)
    # teclado_listener = TecladoListener(validador)
    resultado = []

    # Iniciar el hilo de escucha
    escucha_thread = Thread(target=iniciar_escucha)
    escucha_thread.start()

    return jsonify({"status": "Test iniciado"}), 200

# Endpoint para terminar el test
@app.route('/finalizar_test', methods=['GET'])
@cross_origin()
def finalizar_test():

    return finalizarTest()


@app.route('/getUpdate', methods=['GET'])
@cross_origin()
def get_update():
    global arduino, resultado
    #global resultado, teclado_listener, validador

    resultado = arduino.resultados_validacion
    #resultado = teclado_listener.resultados_validacion
    return jsonify(resultado)


# Podria ser a al revez.
@app.route('/resume', methods=['GET'])
@cross_origin()
def resume():
    global arduino, resultado
    #global teclado_listener, resultado
    if len(resultado) == 48:
        finalizarTest()
        return jsonify({"mensaje: se termino el TEST"})

    thread = threading.Thread(target=reproducir_audio)
    thread.start()

    arduino.lock = False
    #teclado_listener.lock = True

    return jsonify({"mensaje": "se renaudo la deteccion"})

@app.route('/devolver_resumen', methods=['GET'])
@cross_origin()
def devolver_resumen():
    global validador
    try:
        result = {
            "num_cat_correctas": validador.numCatCorrectas,
            "num_err_perseverativos": validador.erroresPerseverativos,
            "num_err_no_perseverativos": validador.erroresNoPerseverativos,
            "num_total_errores": validador.totalErrores,
            "porcentaje_errores_perseverativos": (validador.erroresPerseverativos / 48) * 100,
            "fecha_test": validador.fechaEvaluacion,
            "resultado_test": "Bueno" #la fe
        }

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/insertar_paciente', methods=['POST'])
@cross_origin()  ##ojito
def insertar_paciente():
    try:

        iniciarTest()

        db = get_db()
        cursor = db.cursor()

        data = request.get_json()
        validador.fechaEvaluacion = data.get('fecha_evaluacion')[:10]
        dni_paciente = data.get('dni_paciente')
        nombres = data.get('nombres')
        ape_paterno = data.get('ape_paterno')
        ape_materno = data.get('ape_materno')
        fecha_nacimiento = data.get('fecha_nacimiento')[:10]
        sexo = data.get('sexo')

        cursor.execute("""
            INSERT INTO paciente (dni_paciente, nombres, ape_paterno, ape_materno, fecha_nacimiento, sexo)
            VALUES (?, ?, ?, ?, ?, ?);
        """, (dni_paciente, nombres, ape_paterno, ape_materno, fecha_nacimiento, sexo))

        db.commit()
        cursor.close()
        #ojito

        return jsonify({'message': 'Paciente insertado correctamente'}), 200
    except Exception as e:
        finalizarTest()
        print(f"Error al insertar paciente: {e}")
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

        data = request.get_json()
        observaciones = data.get('observaciones')
        insertarTEST(observaciones)
        insertarMOVS()

        return jsonify({'message': 'Historial insertado correctamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/devolverResultadosHistorialPaciente/<dni_paciente>', methods=['GET'])
@cross_origin()
def devolverResultadosHistorialPaciente(dni_paciente):
    try:
        db = get_db()
        cursor = db.cursor()

        cursor.execute("SELECT * FROM historial_test WHERE id_historial = ?;", (dni_paciente,))
        historial_tests = cursor.fetchall()

        cursor.close()

        return jsonify(historial_tests), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/devolverHistorialTestPacientes', methods=['GET'])
@cross_origin()
def devolverHistorialTestPacientes():
    try:
        db = get_db()
        cursor = db.cursor()

        # Obtener todos los historiales
        cursor.execute("SELECT * FROM historial_test;")
        historial_tests = cursor.fetchall()

        # Estructura para almacenar los historiales y sus movimientos
        response_data = []

        for historial in historial_tests:
            historial_id = historial['id_historial']

            # Obtener los movimientos para cada historial
            cursor.execute("SELECT * FROM movimientos WHERE id_historial = ?;", (historial_id,))
            movimientos = cursor.fetchall()

            # Combinar el historial con sus movimientos
            historial_data = {
                'historial': historial,
                'movimientos': movimientos
            }
            response_data.append(historial_data)

        cursor.close()

        return jsonify(response_data), 200
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
        nombres = data.get('nombres')
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
            SET dni_paciente = ?, nombres = ?, ape_paterno = ?, ape_materno = ?, fecha_nacimiento = ?, genero = ?
            WHERE dni_paciente = ?;
        """, (dni_paciente_nuevo, nombres, ape_paterno, ape_materno, fecha_nacimiento, genero,
              dni_paciente_antiguo))

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


def insertarTEST(observaciones):
    global validador, resultado
    db = get_db()
    cursor = db.cursor()

    dni_paciente = validador.idPaciente
    num_cat_correctas = validador.numCatCorrectas
    num_err_perseverativos = validador.erroresPerseverativos
    num_err_no_perseverativos = validador.erroresNoPerseverativos
    num_total_errores = validador.totalErrores
    procentaje_errores_perseverativos = (validador.erroresPerseverativos / 48) * 100
    observaciones = observaciones
    fecha_test = validador.fechaEvaluacion
    resultado_test = "BUENO"

    cursor.execute("""
                INSERT INTO historial_test (id_historial, num_cat_correctas, num_err_perseverativos, num_err_no_perseverativos, 
                                           num_total_errores, procentaje_errores_perseverativos, observaciones, fecha_test, resultado_test)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            """, (dni_paciente, num_cat_correctas, num_err_perseverativos, num_err_no_perseverativos, num_total_errores,
                  procentaje_errores_perseverativos, observaciones, fecha_test, resultado_test))

    db.commit()
    cursor.close()


def insertarMOVS():
    global validador, resultado

    db = get_db()
    cursor = db.cursor()

    movimientos = resultado

    if not movimientos:
        return jsonify({'error': 'Lista de movimientos vacía'}), 400

    for movimiento in movimientos:
        numero_tarjeta = movimiento['numero_tarjeta']
        resultado2 = movimiento['resultado']
        categoria_esperada_id = movimiento['categoria']
        categoria_propuesta_id = movimiento['datos_tarjeta']['categoria']
        id_historial = validador.idPaciente

        cursor.execute("""
                    INSERT INTO movimiento (numero_tarjeta, resultado, categoria_esperada_id, categoria_propuesta_id, id_historial)
                    VALUES (?, ?, ?, ?, ?);
                """, (numero_tarjeta, resultado2, categoria_esperada_id, categoria_propuesta_id, id_historial))

    db.commit()
    cursor.close()


def finalizarTest():
    global arduino, escucha_thread, resultado, validador
    if arduino:
        arduino.escucha = False
        if escucha_thread:
            escucha_thread.join()
            escucha_thread = None
            arduino = None
            validador = None
            # teclado_listener = None
            resultado = []
            escucha_thread = None
            print("ENTRE")
        return jsonify({"status": "Escuchador detenido"}), 200
    else:
        return jsonify({"error": "Arduino no inicializado"}), 400



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
