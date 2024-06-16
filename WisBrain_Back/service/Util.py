import datetime

def calcularEdad(fechaNacimiento):
    fechaActual = datetime.date.today()

    fechaNacimiento = datetime.datetime.strptime(fechaNacimiento, "%m/%d/%Y").date()

    if fechaNacimiento >= fechaActual:
        return False

    edad = fechaActual.year - fechaNacimiento.year

    if fechaNacimiento.month > fechaActual.month or (
            fechaNacimiento.month == fechaActual.month and fechaNacimiento.day > fechaActual.day):
        edad -= 1

    return edad

def obtenerFechaActual():
    fechaActual = datetime.date.today()
    fechaFormateada = fechaActual.strftime("%m/%d/%Y")
    return fechaFormateada




