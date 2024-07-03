insert into rangos (nombre) values
	('Rendimiento cognitivo alto'),
	('Rendimiento cognitivo promedio'),
	('Rendimiento cognitivo bajo'),
	('Flexibilidad cognitiva alta'),
	('Flexibilidad cognitiva promedio'),
	('Flexibilidad cognitiva baja');
	
insert into edades (edad_min, edad_max) values
	(50, 65),
	(66, 75),
	(76, 80),
	(80, 200);
	
insert into baremos_rendimiento (valor_min, valor_max, id_edad, id_rango) values
	(11, 48, 1, 3),
	(5, 10, 1, 2),
	(1, 4, 1, 1),
	(15, 48, 2, 3),
	(8, 14, 2, 2),
	(0, 7, 2, 1),
	(15, 48, 3, 3),
	(8, 14, 3, 2),
	(0, 7, 3, 1),
	(22, 48, 4, 3),
	(11, 21, 4, 2),
	(0, 10, 4, 1);

insert into baremos_flexibilidad (valor_min, valor_max, id_rango) values
	(0, 8, 4),
	(9, 14, 5),
	(15, 48, 6);
	