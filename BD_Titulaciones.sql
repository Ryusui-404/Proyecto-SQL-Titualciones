CREATE DATABASE TitulacionesBDNR;

-- Usar la base de datos
USE TitulacionesBDNR;

-- Tabla Facultades
CREATE TABLE Facultades (
    IdFacultad VARCHAR(10) PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL
);

-- Tabla Carreras
CREATE TABLE Carreras (
    IdCarrera VARCHAR(10) PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    IdFacultad VARCHAR(10),
    FOREIGN KEY (IdFacultad) REFERENCES Facultades(IdFacultad)
);

-- Tabla Modalidades
CREATE TABLE Modalidades (
    IdModalidad VARCHAR(10) PRIMARY KEY,
    Modalidad VARCHAR(50) NOT NULL
);

-- Tabla Docentes
CREATE TABLE Docentes (
    Ntrbj VARCHAR(10) PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL
);

-- Tabla Estudiantes
CREATE TABLE Estudiantes (
    Ncta INT PRIMARY KEY,
    Nombre VARCHAR(50) NOT NULL,
    Generacion VARCHAR(20) NOT NULL,
    FechaTitulacion DATE NOT NULL,
    IdCarrera VARCHAR(10),
    IdModalidad VARCHAR(10),
    FOREIGN KEY (IdCarrera) REFERENCES Carreras(IdCarrera),
    FOREIGN KEY (IdModalidad) REFERENCES Modalidades(IdModalidad),
);

-- Tabla Proyectos
CREATE TABLE Proyectos (
    Ncta INT,
    Nombre TEXT NOT NULL,
    IdAsesor VARCHAR(10),
    IdCoasesor VARCHAR(10),
    IdSinodal1 VARCHAR(10) NOT NULL,
    IdSinodal2 VARCHAR(10) NOT NULL,
    IdSinodal3 VARCHAR(10) NOT NULL,
    FOREIGN KEY (Ncta) REFERENCES Estudiantes(Ncta),
    FOREIGN KEY (IdAsesor) REFERENCES Docentes(Ntrbj),
    FOREIGN KEY (IdCoasesor) REFERENCES Docentes(Ntrbj),
    FOREIGN KEY (IdSinodal1) REFERENCES Docentes(Ntrbj),
    FOREIGN KEY (IdSinodal2) REFERENCES Docentes(Ntrbj),
    FOREIGN KEY (IdSinodal3) REFERENCES Docentes(Ntrbj)
);
