import threading

import simpleaudio as sa


class Validador:
    def __init__(self, tarjetas):
        self.idPaciente = ""
        self.tarjetas = tarjetas
        self.index_movimiento = 0
        self.formaActualOrdenamiento = None
        self.limiteMovimientosCorrectos = 0
        self.iteracionDeFormaDeOrdenamiento = 0
        self.historialFormasOrdenamiento = []
        self.formaOrdeIncorrecto = None
        self.erroresPerseverativos = 0
        self.erroresNoPerseverativos = 0
        self.totalErrores = 0
        self.contadorEP = 0
        self.numCatCorrectas = 0
        self.fechaEvaluacion = None
        self.idHistorial = None
        self.edadPaciente = None
        self.baremosRendimiento = None
        self.baremosFlexibilidad = None
        self.resultado = {
            "id": 1,
            "resultado": "PENDIENTE",
            "categoria": "PENDIENTE",
            "datos_tarjeta": {
                "forma": "PENDIENTE",
                "color": "PENDIENTE",
                "numero": 0,
                "categoria": "PENDIENTE",
            }
        }
        self.audioCorrecto = sa.WaveObject.from_wave_file("WisBrain_Back/assets/correcto.wav")
        self.audioIncorrecto = sa.WaveObject.from_wave_file("WisBrain_Back/assets/incorrecto.wav")
        self.audioCambio = sa.WaveObject.from_wave_file("WisBrain_Back/assets/cambio.wav")

    def validar(self, posicionTarjeta):
        self.resultado['id'] = self.index_movimiento + 1
        print("ID ----> ", self.index_movimiento + 1)

        if self.formaActualOrdenamiento is not None and self.limiteMovimientosCorrectos < 6:
            print("1")
            veredicto = self.correctoOincorrecto(posicionTarjeta)
            # if self.limiteMovimientosCorrectos == 6:
            # play_obj = self.audioCambio.play()
            #   |play_obj.wait_done()
        else:
            print("2")
            self.actualizarFormaOrdenamiento(posicionTarjeta)
            print("Forma actualizada de ordenamieto", self.formaActualOrdenamiento)
            # play_obj = self.audioCambio.play()
            # play_obj.wait_done()
            veredicto = self.correctoOincorrecto(posicionTarjeta)

        # Crear el hilo y pasarlo a la función con los argumentos necesarios
        thread = threading.Thread(target=self.reproducir_audio, args=(veredicto,))

        # Iniciar el hilo
        thread.start()
        '''if veredicto is 'CORRECTO':
            play_obj = self.audioCorrecto.play()
        else:
            play_obj = self.audioIncorrecto.play()

        play_obj.wait_done()

        if self.limiteMovimientosCorrectos == 6:
            play_obj = self.audioCambio.play()
            play_obj.wait_done()
'''
        self.resultado['resultado'] = veredicto
        self.resultado['categoria'] = self.formaActualOrdenamiento
        self.index_movimiento += 1
        return self.resultado

    def correctoOincorrecto(self, pos):
        formaPropuesta = self.buscarSimilitud(pos)
        if formaPropuesta is None:
            self.resultado['datos_tarjeta']['categoria'] = "Otro"
        else:
            self.resultado['datos_tarjeta']['categoria'] = formaPropuesta

        if formaPropuesta == self.formaOrdeIncorrecto and self.contadorEP >= 1:
            self.erroresPerseverativos += 1
        else:
            self.contadorEP = 0


        print("Forma propuesta:", formaPropuesta)
        if formaPropuesta is None:
            print("INCORRECTO")
            self.formaOrdeIncorrecto = formaPropuesta
            self.erroresNoPerseverativos += 1
            return "INCORRECTO"

        if self.formaActualOrdenamiento == formaPropuesta:
            print("CORRECTO")
            if self.limiteMovimientosCorrectos == 6:
                self.limiteMovimientosCorrectos = 0
            self.limiteMovimientosCorrectos += 1
            self.contadorEP = 0
            return "CORRECTO"
        else:
            print("INCORRECTO")
            self.formaOrdeIncorrecto = formaPropuesta
            self.erroresNoPerseverativos += 1
            self.limiteMovimientosCorrectos = 0

            return "INCORRECTO"

    def buscarSimilitud(self, pos):
        self.resultado["datos_tarjeta"]["forma"] = self.tarjetas.tarjetasPaciente[self.index_movimiento][3]
        self.resultado["datos_tarjeta"]["color"] = self.tarjetas.tarjetasPaciente[self.index_movimiento][1]
        self.resultado["datos_tarjeta"]["numero"] = self.tarjetas.tarjetasPaciente[self.index_movimiento][2]

        if self.tarjetas.tarjetasPaciente[self.index_movimiento][1] == self.tarjetas.tarjetasBase[pos][1]:
            return "Color"
        elif self.tarjetas.tarjetasPaciente[self.index_movimiento][2] == self.tarjetas.tarjetasBase[pos][2]:
            return "Número"
        elif self.tarjetas.tarjetasPaciente[self.index_movimiento][3] == self.tarjetas.tarjetasBase[pos][3]:
            return "Forma"
        else:
            return None

    def actualizarFormaOrdenamiento(self, posicion):
        self.formaActualOrdenamiento = self.buscarSimilitud(posicion)
        print("iteracion forma ordenamiento: ", self.iteracionDeFormaDeOrdenamiento)
        if self.formaActualOrdenamiento in self.historialFormasOrdenamiento and self.iteracionDeFormaDeOrdenamiento < 3:
            print("estas repitiendo")
            self.formaActualOrdenamiento = None
            return
        elif len(self.historialFormasOrdenamiento) < 3:
            if self.formaActualOrdenamiento is not None:
                self.historialFormasOrdenamiento.append(self.formaActualOrdenamiento)
            else:
                return
        else:
            if self.iteracionDeFormaDeOrdenamiento in (3, 6):
                self.formaActualOrdenamiento = self.historialFormasOrdenamiento[0]
            elif self.iteracionDeFormaDeOrdenamiento in (4, 7):
                self.formaActualOrdenamiento = self.historialFormasOrdenamiento[1]
            elif self.iteracionDeFormaDeOrdenamiento == 5:
                self.formaActualOrdenamiento = self.historialFormasOrdenamiento[2]
        self.iteracionDeFormaDeOrdenamiento += 1

    def reproducir_audio(self, veredicto):
        if veredicto == 'CORRECTO':
            play_obj = self.audioCorrecto.play()
        else:
            play_obj = self.audioIncorrecto.play()
            self.contadorEP += 1
            self.totalErrores += 1

        play_obj.wait_done()

        if self.limiteMovimientosCorrectos == 6:
            self.numCatCorrectas += 1
            play_obj = self.audioCambio.play()
            play_obj.wait_done()
        print("Errores Perseverativos:", self.erroresPerseverativos)
