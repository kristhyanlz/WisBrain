from WisBrain_Back.bd.DataHelper import DataHelper


class Tarjetas:
    def __init__(self):
        self.dbHelper = DataHelper()
        self.tarjetasBase = self.dbHelper.obtenerTarjetasBase()
        self.tarjetasPaciente = self.dbHelper.obtenerTarjetasOriginales()
