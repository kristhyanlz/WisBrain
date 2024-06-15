from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from threading import Thread
from service.Arduino import Arduino
from service.Validador import Validador
from service.Tarjetas import Tarjetas

from WisBrain_Back.service.TecladoListener import TecladoListener

import logging

#python -m flask run

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

# Inicializar la clase Arduino, Tarjetas y Validador
# arduino = Arduino('COM5')
tarjetas = Tarjetas()
validador = Validador(tarjetas)
teclado_listener = TecladoListener(validador)
resultado = []


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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
