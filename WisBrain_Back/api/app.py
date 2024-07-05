import sqlite3
import threading

from flask import Flask, jsonify, request, g, send_file
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
from WisBrain_Back.service.pdf import generate_pdf

from WisBrain_Back.service.TecladoListener import TecladoListener

import logging

#python -m flask run
#python -m flask --app ./WisBrain_Back/api/app.py run
#sudo apt-get install -y python3-dev libasound2-dev

ARDUINO_PORT = 'COM1'

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

#/log = logging.getLogger('werkzeug')
#log.setLevel(logging.ERROR)

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
    arduino = Arduino(ARDUINO_PORT)
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

  resultado = arduino.resultados_validacion if arduino.resultados_validacion else []
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
        return jsonify({"mensaje": "termino"})

    thread = threading.Thread(target=reproducir_audio)
    thread.start()

    arduino.lock = False
    #teclado_listener.lock = True

    return jsonify({"mensaje": "se renaudo la deteccion"})


@app.route('/descargar_pdf', methods=['GET'])
def descargar_pdf():
    # Generar el PDF utilizando la función separada
    pdf_buffer = generate_pdf()

    # Devolver el PDF como una descarga
    return send_file(pdf_buffer, as_attachment=True, download_name='ejemplo.pdf', mimetype='application/pdf')


if __name__ == '__main__':
    app.run(debug=True)


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
            "baremos_rendimiento": validador.baremosRendimiento,
            "baremos_flexibilidad": validador.baremosFlexibilidad
        }

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/insertar_paciente', methods=['POST'])
@cross_origin()  ##ojito
def insertar_paciente():
    global validador
    try:

        iniciarTest()

        db = get_db()
        cursor = db.cursor()

        data = request.get_json()
        dni_paciente = data.get('dni_paciente')
        nombres = data.get('nombres')
        ape_paterno = data.get('ape_paterno')
        ape_materno = data.get('ape_materno')
        sexo = data.get('sexo')
        fecha_nacimiento = data.get('fecha_nacimiento')[:10]
        edad = data.get('edad')
        fecha_evaluacion = data.get('fecha_evaluacion')[:10]

        cursor.execute("""
      INSERT INTO paciente (dni_paciente, nombres, ape_paterno, ape_materno, sexo, fecha_nacimiento, edad, fecha_evaluacion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    """, (dni_paciente, nombres, ape_paterno, ape_materno, sexo, fecha_nacimiento, edad, fecha_evaluacion))


        db.commit()
        cursor.close()
        #ojito
        validador.edadPaciente = edad
        validador.fechaEvaluacion = fecha_evaluacion
        validador.idPaciente = dni_paciente

        return jsonify({'message': 'Paciente insertado correctamente'}), 200
    except Exception as e:

        #finalizarTest()
        print(f"Error al insertar paciente: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/obtenerFechaActual', methods=['GET'])
@cross_origin()
def obtenerFechaActual():
    result = obtenerFechaActual()
    return jsonify({'fechaActual': result})


@app.route('/insertarObservaciones', methods=['POST'])
@cross_origin()
def insertarObservaciones():
    global validador

    db = get_db()
    cursor = db.cursor()

    try:

        data = request.get_json()
        observaciones = data.get('observaciones')
        cursor.execute("""
                        UPDATE historial_test
                        SET observaciones = ?
                        WHERE dni_paciente = ?;
                    """, (observaciones, validador.idPaciente))

        db.commit()
        cursor.close()

        return jsonify({'message': 'Observaciones insertadas correctamente'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/abortarTest', methods=['GET'])
@cross_origin()
def abortarTest():
    global validador, escucha_thread, resultado, arduino
    try:
        db = get_db()
        cursor = db.cursor()

        # Eliminar al paciente
        cursor.execute("DELETE FROM paciente WHERE dni_paciente = ?;", (validador.idPaciente,))

        db.commit()
        cursor.close()
        validador = None

        if arduino:
            arduino.escucha = False
            if escucha_thread:
                escucha_thread.join()
                escucha_thread = None
                arduino = None
                # teclado_listener = None
                resultado = []
                escucha_thread = None

        return jsonify({"status": "Test abortado"}), 200
    except Exception as e:
        print(e)
        return jsonify({"error": "Arduino no inicializado, pero igual el dni se borro de BD"}), 400


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
        db.row_factory = sqlite3.Row
        cursor = db.cursor()

        # Obtener todos los pacientes
        cursor.execute(
            "SELECT dni_paciente, nombres, ape_paterno, ape_materno, sexo, fecha_nacimiento, edad, fecha_evaluacion FROM paciente;")
        pacientes = [dict(row) for row in cursor.fetchall()]  ########
        response_data = []

        for paciente in pacientes:
            paciente_id = paciente["dni_paciente"]

            # Obtener el historial para el paciente
            cursor.execute("SELECT * FROM historial_test WHERE dni_paciente = ?;", (paciente_id,))
            historial_ = cursor.fetchone()
            historial = dict(historial_) if historial_ else False  ########

            if historial:
                historial_id = historial["id_historial"]

                # Obtener los movimientos para el historial
                cursor.execute("""
          SELECT numero_tarjeta, resultado, c.nombre 
          FROM movimiento 
          INNER JOIN categoria c ON movimiento.categoria_propuesta_id = c.id 
          WHERE movimiento.id_historial = ? 
          ORDER BY CAST(numero_tarjeta AS INTEGER) ASC;
        """, (historial_id,))
                movs = cursor.fetchall()
                print(f"Paciente: {paciente_id} - {movs and True}")
                movimientos = [dict(row) for row in movs] if movs else []  ########

                # Estructura de datos para el paciente con su historial y movimientos
                paciente_data = {
                    'paciente': paciente,
                    'historial': historial,
                    'movimientos': movimientos
                }
                response_data.append(paciente_data)

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
        dni_paciente_nuevo = data.get('dni_paciente_nuevo')
        nombres = data.get('nombres')
        ape_paterno = data.get('ape_paterno')
        ape_materno = data.get('ape_materno')
        sexo = data.get('sexo')
        fecha_nacimiento = data.get('fecha_nacimiento')[:10]
        edad = data.get('edad')
        dni_paciente_antiguo = data.get('dni_paciente_antiguo')

        db = get_db()
        cursor = db.cursor()

        # Inicia la transacción
        cursor.execute("BEGIN TRANSACTION;")

        if dni_paciente_antiguo != dni_paciente_nuevo:
            # Actualiza el paciente en la tabla historial_test
            cursor.execute("""
        UPDATE historial_test
        SET dni_paciente = ?
        WHERE dni_paciente = ?;
      """, (None, dni_paciente_antiguo))

        # Actualiza el paciente en la tabla paciente
        cursor.execute("""
      UPDATE paciente
      SET dni_paciente = ?, nombres = ?, ape_paterno = ?, ape_materno = ?, sexo = ?, fecha_nacimiento = ?, edad = ?
      WHERE dni_paciente = ?;
    """, (dni_paciente_nuevo, nombres, ape_paterno, ape_materno, sexo, fecha_nacimiento, edad,
          dni_paciente_antiguo))

        # Arreglar los UPDATES!!
        # Si el DNI es diferente, actualiza las tablas relacionadas
        if dni_paciente_antiguo != dni_paciente_nuevo:
            # Actualiza el paciente en la tabla historial_test
            cursor.execute("""
        UPDATE historial_test
        SET dni_paciente = ?
        WHERE dni_paciente IS NULL;
      """, (dni_paciente_nuevo,))
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


def insertarTEST():
    global validador  # Suponiendo que validador es una variable global que contiene los datos necesarios

    hallarResultadosRendimiento()
    hallarResultadosFlexibilidad()

    db = get_db()
    cursor = db.cursor()

    dni_paciente = validador.idPaciente
    num_cat_correctas = validador.numCatCorrectas
    num_err_perseverativos = validador.erroresPerseverativos
    num_err_no_perseverativos = validador.erroresNoPerseverativos
    num_total_errores = validador.totalErrores
    porcentaje_errores_perseverativos = (validador.erroresPerseverativos / 48) * 100
    flexibilidad_cognitiva = validador.baremosFlexibilidad
    rendimiento_cognitivo = validador.baremosRendimiento

    cursor.execute("""
        INSERT INTO historial_test 
        (dni_paciente, num_cat_correctas, num_err_perseverativos, num_err_no_perseverativos, 
         num_total_errores, porcentaje_errores_perseverativos, redimiento_cognitivo, flexibilidad_cognitiva)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    """, (dni_paciente, num_cat_correctas, num_err_perseverativos, num_err_no_perseverativos,
          num_total_errores, porcentaje_errores_perseverativos, rendimiento_cognitivo,
          flexibilidad_cognitiva))
    validador.idHistorial = cursor.lastrowid
    print(validador.idHistorial)
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
        numero_tarjeta = movimiento['id']
        resultado2 = movimiento['resultado']
        categoria_esperada_id = movimiento['categoria']
        categoria_propuesta_id = movimiento['datos_tarjeta']['categoria']
        id_historial = validador.idHistorial

        categoria_esperada_id = asignar_categoria_numerica(categoria_esperada_id)
        categoria_propuesta_id = asignar_categoria_numerica(categoria_propuesta_id)

        cursor.execute("""
          INSERT INTO movimiento (id_historial, numero_tarjeta, resultado, categoria_esperada_id, categoria_propuesta_id)
          VALUES (?, ?, ?, ?, ?);
        """, (id_historial, numero_tarjeta, resultado2, categoria_esperada_id, categoria_propuesta_id))

    db.commit()
    cursor.close()


def asignar_categoria_numerica(categoria_textual):
    # Mapear categorías textuales a números según el requerimiento
    categorias = {
        'Color': 1,
        'Forma': 2,
        'Número': 3,
        'Otro': 4
    }
    # Retornar el número correspondiente o un valor por defecto si no se encuentra
    return categorias.get(categoria_textual, 4)


def hallarResultadosRendimiento():
    global validador
    db = get_db()
    cursor = db.cursor()

    # Consulta combinada utilizando INNER JOIN
    cursor.execute("""
        SELECT r.nombre
        FROM edades AS e
        INNER JOIN baremos_rendimiento AS br ON e.id_edad = br.id_edad
        INNER JOIN rangos AS r ON br.id_rango = r.id_rango
        WHERE ? BETWEEN e.edad_min AND e.edad_max
          AND ? BETWEEN br.valor_min AND br.valor_max;
    """, (validador.edadPaciente, validador.totalErrores))

    validador.baremosRendimiento = cursor.fetchone()[0]  # Obtener el primer elemento de la tupla
    cursor.close()


def hallarResultadosFlexibilidad():
    global validador
    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        SELECT r.nombre
        FROM baremos_flexibilidad AS bf
        INNER JOIN rangos AS r ON bf.id_rango = r.id_rango
        WHERE ? BETWEEN bf.valor_min AND bf.valor_max;
    """, (validador.totalErrores,))

    validador.baremosFlexibilidad = cursor.fetchone()[0]
    cursor.close()


def finalizarTest():
    global arduino, escucha_thread, resultado, validador

    #Guardamos todo antes que nada
    insertarTEST()
    insertarMOVS()

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
        return jsonify({"status": "Escuchador detenido"}), 200
    else:
        return jsonify({"error": "Arduino no inicializado"}), 400


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
