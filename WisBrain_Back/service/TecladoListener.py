class TecladoListener:
    def __init__(self, validador):
        self.validador = validador
        self.resultados_validacion = []
        self.lock = False

    def escuchar_teclado(self):
        print("Iniciando escucha de teclado. Presiona 'q' para salir.")
        while True:
            dato = input("Introduce un dato (A, B, C, D): ").strip().upper()
            if dato == 'Q':
                break
            if dato in 'ABCD':
                if self.lock is True:
                    self.procesar_dato(dato)
                else:
                    print("No hay autorización")
            else:
                print("Dato inválido. Intenta de nuevo.")

    def procesar_dato(self, dato):
        self.lock = False
        mapeo = {'A': 0, 'B': 1, 'C': 2, 'D': 3}
        valor = mapeo[dato]
        print(f"Procesando dato: {dato}, Valor: {valor}")
        resultado_validacion = self.validador.validar(valor)
        resultado_validacion = resultado_validacion.copy()
        resultado_validacion['datos_tarjeta'] = resultado_validacion['datos_tarjeta'].copy()
        info = '1' if (resultado_validacion['resultado'] == 'CORRECTO') else '0'
        print(f"Dato procesado: {dato}, Resultado validación: {resultado_validacion}, Info: {info}")
        self.resultados_validacion.append(resultado_validacion)

