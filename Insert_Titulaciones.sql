USE TitulacionesBDNR;

-- Facultades
INSERT INTO Facultades (IdFacultad, Nombre) VALUES
('F1', 'Facultad de Ingenieria Mecanica y Electrica'),
('F2', 'Facultad de Ingenieria Civil'),
('F3', 'Facultad de Ciencias Quimicas');

-- Carreras
INSERT INTO Carreras (IdCarrera, Nombre, IdFacultad) VALUES
('C1', 'Ingenieria en Computacion Inteligente', 'F1'),
('C2', 'Ingeniero Mecanico Electrisista', 'F1'),
('C3', 'Ingeniero Civil', 'F2'),
('C4', 'Ingenieria en Mecatr�nica', 'F1'),
('C5', 'Ingeniero Quimico en Alimentos', 'F3'),
('C6', 'Ingenieria en Sistemas', 'F1');

-- Modalidades
INSERT INTO Modalidades (IdModalidad, Modalidad) VALUES
('M1', 'Tesis'),                           
('M2', 'Tesina'),                         
('M3', 'Estancia Profesional'),            
('M4', 'Obra Artistica'),                  
('M5', 'Articulo'),                        
('M6', 'EGEL'),                            
('M7', 'Desempe�o Acad�mico Sobresaliente'), 
('M8', 'Certificaci�n'),                   
('M9', 'Posgrado - Diplomado');           

-- Docentes
INSERT INTO Docentes (Ntrbj, Nombre) VALUES
('D1', 'Walter Alexander Mata Lopez'),
('D2', 'Nava Bautista Martha Xochitl'),
('D3', 'Moran Lopez Luis Eduardo'),
('D4', 'Oscar Octavio Ochoa Zu�iga'),
('D5', 'Juan Antonio Diaz Hernandez'),
('D6', 'Evangelista Salazar Martha Elizabeth'),
('D7', 'Apolinar Gonz�lez Apotes'),
('D8', 'Ricardo Montes Silva'),
('D9', 'Alejandra Gutierrez Ramirez'),
('D10', 'Fernando Ruiz Pineda');

-- Estudiantes
INSERT INTO Estudiantes (Ncta, Nombre, Generacion, FechaTitulacion, IdCarrera, IdModalidad) VALUES
(20240001, 'Alberto Chavez Rangel', '2016-2020', '2020-02-02', 'C1', 'M1'),
(20240002, 'Leonardo Jesus Carrillo Bivian', '2017-2021', '2021-05-05', 'C2', 'M2'),
(20240003, 'Efrain Alejandro Arias Meza', '2020-2024', '2024-09-10', 'C3', 'M3'),
(20240004, 'Pablo Francisco Decena Romero', '2022-2026', '2026-02-14', 'C4', 'M4'),
(20240005, 'Luis Alejandro Mejia Duran', '2015-2019', '2019-03-16', 'C5', 'M5'),
(20240006, 'Maria Fernanda Lopez Hernandez', '2018-2022', '2022-07-10', 'C6', 'M6'),
(20240007, 'Jose Antonio Ramirez Torres', '2019-2023', '2023-11-22', 'C1', 'M7'),
(20240008, 'Andrea Carolina Sanchez Rivera', '2017-2021', '2021-04-18', 'C2', 'M8'),
(20240009, 'Carlos Eduardo Martinez Ortiz', '2021-2025', '2025-06-15', 'C3', 'M9'),
(20240010, 'Sofia Alejandra Torres Mej�a', '2019-2023', '2023-12-01', 'C4', 'M1'),
(20240011, 'Jorge Luis Hern�ndez Vega', '2016-2020', '2020-07-07', 'C5', 'M2'),
(20240012, 'Gabriela Romero Casta�eda', '2020-2024', '2024-10-15', 'C6', 'M3'),
(20240013, 'Hugo Alberto Salinas Ortiz', '2017-2021', '2021-06-25', 'C2', 'M4'),
(20240014, 'Ana Isabel P�rez Rodr�guez', '2018-2022', '2022-09-03', 'C1', 'M5'),
(20240015, 'Ricardo Antonio Cruz Mendoza', '2021-2025', '2025-11-20', 'C3', 'M6'),
(20240016, 'Fernanda Lizbeth Ruiz Morales', '2019-2023', '2023-04-30', 'C6', 'M7'),
(20240017, 'Daniel Alejandro Pineda Torres', '2018-2022', '2022-08-12', 'C5', 'M8'),
(20240018, 'Carolina Mart�nez Lozano', '2022-2026', '2026-05-19', 'C4', 'M9');

-- Proyectos
INSERT INTO Proyectos (Ncta, Nombre, IdAsesor, IdCoasesor, IdSinodal1, IdSinodal2, IdSinodal3) VALUES
(20240001, 'Generador e�lico de baja potencia', 'D1', 'D2', 'D3', 'D4', 'D5'), -- M1
(20240002, 'Dise�o de estructuras antis�smicas', 'D3', 'D4', 'D6', 'D7', 'D8'), -- M2
(20240003, 'Optimizaci�n de sistemas mecatr�nicos', 'D5', 'D6', 'D1', 'D2', 'D9'), -- M3
(20240004, 'Desarrollo de un snack nutritivo', 'D7', 'D8', 'D2', 'D3', 'D10'), -- M4
(20240005, 'Estudio de corrosi�n en materiales', 'D9', 'D10', 'D1', 'D4', 'D6'), -- M5
(20240009, 'Energ�as renovables en zonas rurales', NULL, NULL, 'D3', 'D5', 'D10'), -- M9
(20240010, 'Robot aut�nomo para asistencia en hospitales', 'D2', 'D2', 'D4', 'D6', 'D8'), -- M1
(20240011, 'Tratamiento de aguas residuales en zonas urbanas', 'D7', 'D5', 'D1', 'D9', 'D10'), -- M2
(20240012, 'Sistema inteligente de control de tr�fico', 'D3', 'D4', 'D7', 'D2', 'D9'), -- M3
(20240013, 'Dise�o de pr�tesis mec�nicas personalizadas', 'D8', 'D6', 'D2', 'D4', 'D8'), -- M4
(20240014, 'Nanopart�culas aplicadas a la industria alimentaria', 'D9', 'D7', 'D1', 'D5', 'D9'), -- M5
(20240018, 'Evaluaci�n de energ�a solar en comunidades rurales', NULL, NULL, 'D3', 'D6', 'D4'); -- M9

