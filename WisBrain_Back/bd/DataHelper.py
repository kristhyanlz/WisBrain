import sqlite3
class DataHelper:
    def __init__(self):
        self.conexion = sqlite3.connect('WisBrain_Back/bd/database_wb.db')
        self.conexion.execute("PRAGMA foreign_keys = ON;")

    def obtenerTarjetasBase(self):
        cursor = self.conexion.cursor()
        query = "SELECT * FROM tarjeta WHERE numero_tarjeta in ('a', 'b', 'c', 'd');"
        cursor.execute(query)
        tarjetas_base = cursor.fetchall()
        cursor.close()
        return tarjetas_base

    def obtenerTarjetasOriginales(self):
        cursor = self.conexion.cursor()
        query = "SELECT * FROM tarjeta WHERE NOT numero_tarjeta in ('a', 'b', 'c', 'd');"
        cursor.execute(query)
        tarjetas_originales = cursor.fetchall()
        cursor.close()
        return tarjetas_originales

    def insertarPaciente(self, dni_paciente, primer_nombre, segundo_nombre, ape_paterno, ape_materno, fecha_nacimiento,
                         genero):
        cursor = self.conexion.cursor()
        cursor.execute("""
            INSERT INTO paciente (dni_paciente, primer_nombre, segundo_nombre, ape_paterno, ape_materno, fecha_nacimiento, genero)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (dni_paciente, primer_nombre, segundo_nombre, ape_paterno, ape_materno, fecha_nacimiento, genero))
        self.conexion.commit()
        cursor.close()

    def actualizarPaciente(self, dni_paciente_antiguo, dni_paciente_nuevo, primer_nombre, segundo_nombre, ape_paterno,
                           ape_materno,
                           fecha_nacimiento, genero):
        try:
            cursor = self.conexion.cursor()

            # Inicia la transacción
            cursor.execute("BEGIN TRANSACTION;")

            # Actualiza el paciente en la tabla paciente
            cursor.execute("""
                UPDATE paciente
                SET dni_paciente = ?, primer_nombre = ?, segundo_nombre = ?, ape_paterno = ?, ape_materno = ?, fecha_nacimiento = ?, genero = ?
                WHERE dni_paciente = ?;
            """, (dni_paciente_nuevo, primer_nombre, segundo_nombre, ape_paterno, ape_materno, fecha_nacimiento, genero,
                  dni_paciente_antiguo))

            # Actualiza el paciente en la tabla historial_test
            cursor.execute("""
                UPDATE historial_test
                SET id_historial = ?
                WHERE id_historial = ?;
            """, (dni_paciente_nuevo, dni_paciente_antiguo))

            # Actualiza el paciente en la tabla movimiento
            cursor.execute("""
                UPDATE movimiento
                SET id_historial = ?
                WHERE id_historial = ?;
            """, (dni_paciente_nuevo, dni_paciente_antiguo))

            # Finaliza la transacción
            cursor.execute("COMMIT;")

            return True
        except Exception as e:
            print(f"Error al actualizar paciente: {e}")
            # Revierte la transacción en caso de error
            cursor.execute("ROLLBACK;")
            return False
        finally:
            cursor.close()

    def eliminarHistorialPaciente(self, dni_paciente):
        cursor = self.conexion.cursor()
        cursor.execute("""
            DELETE FROM historial_test WHERE id_historial = ?;
        """, (dni_paciente,))
        self.conexion.commit()
        cursor.close()

    def devolverDatosPaciente(self, dni_paciente):
        cursor = self.conexion.cursor()
        cursor.execute("SELECT * FROM paciente WHERE dni_paciente = ?;", (dni_paciente,))
        datos_paciente = cursor.fetchone()
        cursor.close()
        return datos_paciente

    def insertarHistorialTestAUnPaciente(self, id_historial, num_cat_correctas, num_err_perseverativos,
                                         num_err_no_perseverativos, num_total_errores,
                                         porcentaje_errores_perseverativos, observaciones, fecha_test):
        cursor = self.conexion.cursor()
        cursor.execute("""
            INSERT INTO historial_test (id_historial, num_cat_correctas, num_err_perseverativos, num_err_no_perseverativos, num_total_errores, procentaje_errores_perseverativos, observaciones, fecha_test)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        """, (id_historial, num_cat_correctas, num_err_perseverativos, num_err_no_perseverativos, num_total_errores,
              porcentaje_errores_perseverativos, observaciones, fecha_test))
        self.conexion.commit()
        cursor.close()

    def devolverHistorialTestPacientes(self, dni_paciente):
        cursor = self.conexion.cursor()
        cursor.execute("SELECT * FROM historial_test WHERE id_historial = ?;", (dni_paciente,))
        historial_tests = cursor.fetchall()
        cursor.close()
        return historial_tests

    def insertarMovimientos(self, movimientos):
        cursor = self.conexion.cursor()
        try:
            for movimiento in movimientos:
                numero_tarjeta = movimiento.get('id')
                resultado = movimiento.get('resultado')
                categoria_esperada_id = movimiento.get('categoria_esperada_id')
                categoria_propuesta_id = movimiento.get('categoria_propuesta_id')
                id_historial = movimiento.get('id_historial')

                cursor.execute("""
                    INSERT INTO movimiento (numero_tarjeta, resultado, categoria_esperada_id, categoria_propuesta_id, id_historial)
                    VALUES (?, ?, ?, ?, ?);
                """, (numero_tarjeta, resultado, categoria_esperada_id, categoria_propuesta_id, id_historial))

            self.conexion.commit()
            return True
        except Exception as e:
            print(f"Error al insertar movimientos: {e}")
            self.conexion.rollback()
            return False
        finally:
            cursor.close()

    def cerrarConexion(self):
        self.conexion.close()
