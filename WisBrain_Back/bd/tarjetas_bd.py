import sqlite3
con = sqlite3.connect('bdWisBrain.db')

cursor = con.cursor()
query = "SELECT * FROM tarjeta WHERE numero_tarjeta in ('a', 'b', 'c', 'd');"
cursor.execute(query)
TarjetasBase = cursor.fetchall()
cursor.close()

cursor2 = con.cursor()
query2 = "SELECT * FROM tarjeta WHERE NOT numero_tarjeta in ('a', 'b', 'c', 'd');"
cursor2.execute(query2)
TarjetasOriginales = cursor2.fetchall()
cursor2.close()

con.close()

def devolverTarjetasBase():
    return TarjetasBase

def devolverTarjetasOriginales():
    return TarjetasOriginales
