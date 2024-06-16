class ValidadorEntradaDB:
    def __init__(self):
        pass

    def validarDNI(self, dni):
        if not dni.isdigit() or len(dni) != 8:
            return False
        return True

    def validarNombres(self, nombres):
        if not nombres.isalpha():
            return False
        return True

    def validarApellidos(self, apellidos):
        if not apellidos.isalpha():
            return False
        return True

    def validarFechaNacimiento(self, fecha_nacimiento):
        return True

    def validarDatosPaciente(self, dni, nombres, apellidos, fecha_nacimiento):
        if not self.validarDNI(dni):
            return False
        if not self.validarNombres(nombres):
            return False
        if not self.validarApellidos(apellidos):
            return False
        if not self.validarFechaNacimiento(fecha_nacimiento):
            return False

        return True
