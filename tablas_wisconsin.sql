CREATE TABLE IF NOT EXISTS rangos (
	 id_rango integer PRIMARY KEY autoincrement NOT NULL,
	 nombre varchar (80) NOT NULL
);


CREATE TABLE IF NOT EXISTS edades (
	id_edad integer PRIMARY KEY autoincrement NOT NULL,
	edad_min integer NOT NULL,
	edad_max integer NOT NULL 
);

CREATE TABLE IF NOT EXISTS  baremos_rendimiento (
	id_rendi integer PRIMARY KEY autoincrement NOT NULL,
	valor_min integer NOT NULL,
	valor_max integer NOT NULL, 
	id_edad integer NOT NULL,
	id_rango integer NOT NULL,
	FOREIGN KEY (id_edad) REFERENCES edades (id_edad),
	FOREIGN KEY (id_rango) REFERENCES rangos (id_rangos)
);

CREATE TABLE IF NOT EXISTS baremos_flexibilidad (
	id_flexi integer PRIMARY KEY autoincrement NOT NULL,
	valor_min integer NOT NULL,
	valor_max integer NOT NULL, 
	id_rango integer NOT NULL,
	FOREIGN KEY (id_rango) REFERENCES rangos (id_rango)
);
