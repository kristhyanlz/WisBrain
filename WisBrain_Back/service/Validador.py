class Validador:
    def __init__(self, tarjetas):
        self.tarjetas = tarjetas
        self.index_movimiento = 0
        self.formaActualOrdenamiento = None
        self.limiteMovimientosCorrectos = 0
        self.iteracionDeFormaDeOrdenamiento = 0
        self.historialFormasOrdenamiento = []
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

    def validar(self, posicionTarjeta):
        self.resultado['id'] = self.index_movimiento + 1
        print("ID ----> ", self.index_movimiento + 1)

        if self.formaActualOrdenamiento is not None and self.limiteMovimientosCorrectos < 6:
            print("1")
            veredicto = self.correctoOincorrecto(posicionTarjeta)
        else:
            print("2")
            self.actualizarFormaOrdenamiento(posicionTarjeta)
            print("Forma actualizada de ordenamieto", self.formaActualOrdenamiento)
            veredicto = self.correctoOincorrecto(posicionTarjeta)

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

        print("Forma propuesta:", formaPropuesta)
        if formaPropuesta is None:
            print("INCORRECTO")
            return "INCORRECTO"

        if self.formaActualOrdenamiento == formaPropuesta:
            print("CORRECTO")
            if self.limiteMovimientosCorrectos == 6:
                self.limiteMovimientosCorrectos = 0
            self.limiteMovimientosCorrectos += 1
            return "CORRECTO"
        else:
            print("INCORRECTO")
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
