import serial

class Arduino:
    def __init__(self, port, baud_rate=9600):
        self.puerto_serial = serial.Serial(port, baud_rate)
        self.recibido = {"A": True, "B": True, "C": True, "D": True}
        self.resultados_validacion = []
        self.lock = False

    def enviar_dato(self, dato):
        # Enviar dato al Arduino
        self.puerto_serial.write(dato.encode())
        print(f"Dato enviado: {dato}")

    def recibir_datos(self, validador):
        if self.puerto_serial.in_waiting > 0:
            datos_recibidos = self.puerto_serial.readline().decode().strip()
            print("Datos recibidos:", datos_recibidos)
            if not self.lock:
                self.procesar_dato(datos_recibidos, validador)

                print("Resultados", self.resultados_validacion)
            else:
                print("En espera")

    def procesar_dato(self, dato, validador):
        estado = False if (dato[1] == "0") else True
        if self.recibido[dato[0]] != estado:
            self.recibido[dato[0]] = estado
            if estado:
                self.lock = True
                resultado_validacion = validador.validar({"A": 0, "B": 1, "C": 2, "D": 3}[dato[0]])
                resultado_validacion = resultado_validacion.copy()
                resultado_validacion['datos_tarjeta'] = resultado_validacion['datos_tarjeta'].copy()
                info = '1' if (resultado_validacion['resultado'] == 'CORRECTO') else '0'
                self.enviar_dato(info)
                print("Ojo----->", resultado_validacion)
                self.resultados_validacion.append(resultado_validacion)

    def recibir_datos_continuamente(self, validador):
        while True:
            self.recibir_datos(validador)
