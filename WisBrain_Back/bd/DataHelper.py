import sqlite3
import datetime


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

    def actualizarPaciente(self, dni_paciente, primer_nombre, segundo_nombre, ape_paterno, ape_materno,
                           fecha_nacimiento, genero):
        cursor = self.conexion.cursor()
        cursor.execute("""
            UPDATE paciente
            SET primer_nombre = ?, segundo_nombre = ?, ape_paterno = ?, ape_materno = ?, fecha_nacimiento = ?, genero = ?
            WHERE dni_paciente = ?;
        """, (primer_nombre, segundo_nombre, ape_paterno, ape_materno, fecha_nacimiento, genero, dni_paciente))
        self.conexion.commit()
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
                                         procentaje_errores_perseverativos, observaciones, fecha_test):
        cursor = self.conexion.cursor()
        cursor.execute("""
            INSERT INTO historial_test (id_historial, num_cat_correctas, num_err_perseverativos, num_err_no_perseverativos, num_total_errores, procentaje_errores_perseverativos, observaciones, fecha_test)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        """, (id_historial, num_cat_correctas, num_err_perseverativos, num_err_no_perseverativos, num_total_errores,
              procentaje_errores_perseverativos, observaciones, fecha_test))
        self.conexion.commit()
        cursor.close()

    def devolverHistorialTestPacientes(self, dni_paciente):
        cursor = self.conexion.cursor()
        cursor.execute("SELECT * FROM historial_test WHERE id_historial = ?;", (dni_paciente,))
        historial_tests = cursor.fetchall()
        cursor.close()
        return historial_tests

    def insertarMovimiento(self, numero_tarjeta, resultado, categoria_esperada_id, categoria_propuesta_id,
                           id_historial):
        cursor = self.conexion.cursor()
        cursor.execute("""
            INSERT INTO movimiento (numero_tarjeta, resultado, categoria_esperada_id, categoria_propuesta_id, id_historial)
            VALUES (?, ?, ?, ?, ?);
        """, (numero_tarjeta, resultado, categoria_esperada_id, categoria_propuesta_id, id_historial))
        self.conexion.commit()
        cursor.close()

    def cerrarConexion(self):
        self.conexion.close()
