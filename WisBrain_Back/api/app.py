from flask import Flask, jsonify
from flask_cors import CORS, cross_origin
from threading import Thread
from service.Arduino import Arduino
from service.Validador import Validador
from service.Tarjetas import Tarjetas

#python -m flask run

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# Inicializar la clase Arduino, Tarjetas y Validador
arduino = Arduino('COM5')
tarjetas = Tarjetas()
validador = Validador(tarjetas)
resultado = []


# Método para iniciar el escucha de datos del Arduino
def iniciar_escucha():
    global arduino
    tarjetas = Tarjetas()
    validador = Validador(tarjetas)
    arduino.recibir_datos_continuamente(validador)

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
    global arduino, resultado
    resultado = arduino.resultados_validacion
    # Devuelve la lista completa de resultados
    return jsonify(resultado)

# Podria ser a al revez.
@app.route('/resume', methods=['GET'])
@cross_origin()
def resume():
    global arduino
    arduino.lock = False
    return jsonify({"mensaje": "se renaudo la deteccion"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
