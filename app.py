from flask import Flask, jsonify
from threading import Thread
from arduino2 import Arduino
from Validador import Validador
from Tarjetas import Tarjetas

app = Flask(__name__)

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
def hello_world():
    return 'Hello Wis!'

@app.route('/getUpdate', methods=['GET'])
def get_update():
    global arduino, resultado
    resultado = arduino.resultados_validacion
    # Devuelve la lista completa de resultados
    return jsonify(resultado)

@app.route('/resume', methods=['GET'])
def resume():
    global arduino
    arduino.lock = False
    return jsonify({"mensaje": "se renaudo la deteccion"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
