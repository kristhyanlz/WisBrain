from bd import tarjetas_bd

class Tarjetas:
    def __init__(self):
        self.tarjetasBase = tarjetas_bd.devolverTarjetasBase()
        self.tarjetasPaciente = tarjetas_bd.devolverTarjetasOriginales()
