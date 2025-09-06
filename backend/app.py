from flask import Flask, jsonify, request
from db import get_connection
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- Endpoints para obtener datos para los filtros ---

@app.route("/api/facultades", methods=["GET"])
def get_facultades():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT IdFacultad, Nombre FROM Facultades ORDER BY Nombre")
    facultades = [{"id": row.IdFacultad, "nombre": row.Nombre} for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(facultades)

@app.route("/api/carreras", methods=["GET"])
def get_carreras():
    id_facultad = request.args.get('id_facultad')
    conn = get_connection()
    cursor = conn.cursor()
    query = "SELECT IdCarrera, Nombre FROM Carreras"
    params = []
    if id_facultad:
        query += " WHERE IdFacultad = ?"
        params.append(id_facultad)
    query += " ORDER BY Nombre"
    cursor.execute(query, tuple(params))
    carreras = [{"id": row.IdCarrera, "nombre": row.Nombre} for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(carreras)

@app.route("/api/modalidades", methods=["GET"])
def get_modalidades():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT IdModalidad, Modalidad FROM Modalidades ORDER BY Modalidad")
    modalidades = [{"id": row.IdModalidad, "nombre": row.Modalidad} for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(modalidades)

@app.route("/api/docentes", methods=["GET"])
def get_docentes():
    id_facultad = request.args.get('id_facultad')
    conn = get_connection()
    cursor = conn.cursor()
    # Asocia docentes a una facultad si han participado en proyectos de carreras de esa facultad
    query = """
        SELECT DISTINCT d.Ntrbj, d.Nombre 
        FROM Docentes d
    """
    params = []
    if id_facultad:
        query += """
            JOIN Proyectos p ON d.Ntrbj IN (p.IdAsesor, p.IdCoasesor, p.IdSinodal1, p.IdSinodal2, p.IdSinodal3)
            JOIN Estudiantes e ON p.Ncta = e.Ncta
            JOIN Carreras c ON e.IdCarrera = c.IdCarrera
            WHERE c.IdFacultad = ?
        """
        params.append(id_facultad)
    
    query += " ORDER BY d.Nombre"
    cursor.execute(query, tuple(params))
    docentes = [{"id": row.Ntrbj, "nombre": row.Nombre} for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return jsonify(docentes)


# --- Endpoint principal para filtrar y obtener estudiantes ---

@app.route("/api/estudiantes", methods=["GET"])
def get_estudiantes_filtrados():
    # Argumentos del query string
    facultad_id = request.args.get('facultad_id')
    carrera_id = request.args.get('carrera_id')
    docente_id = request.args.get('docente_id')
    year_from = request.args.get('year_from')
    year_to = request.args.get('year_to')

    conn = get_connection()
    cursor = conn.cursor()
    
    query = """
    SELECT 
        e.Ncta, e.Nombre, e.Generacion, e.FechaTitulacion,
        c.Nombre as Carrera, f.Nombre as Facultad, m.Modalidad,
        p.Nombre as Proyecto,
        d1.Nombre as Asesor, d2.Nombre as Coasesor,
        d3.Nombre as Sinodal1, d4.Nombre as Sinodal2, d5.Nombre as Sinodal3
    FROM Estudiantes e
    LEFT JOIN Carreras c ON e.IdCarrera = c.IdCarrera
    LEFT JOIN Facultades f ON c.IdFacultad = f.IdFacultad
    LEFT JOIN Modalidades m ON e.IdModalidad = m.IdModalidad
    LEFT JOIN Proyectos p ON e.Ncta = p.Ncta
    LEFT JOIN Docentes d1 ON p.IdAsesor = d1.Ntrbj
    LEFT JOIN Docentes d2 ON p.IdCoasesor = d2.Ntrbj
    LEFT JOIN Docentes d3 ON p.IdSinodal1 = d3.Ntrbj
    LEFT JOIN Docentes d4 ON p.IdSinodal2 = d4.Ntrbj
    LEFT JOIN Docentes d5 ON p.IdSinodal3 = d5.Ntrbj
    WHERE 1=1
    """
    params = []

    if facultad_id:
        query += ' AND f.IdFacultad = ?'
        params.append(facultad_id)
    if carrera_id:
        query += ' AND c.IdCarrera = ?'
        params.append(carrera_id)
    if docente_id:
        query += ' AND (? IN (p.IdAsesor, p.IdCoasesor, p.IdSinodal1, p.IdSinodal2, p.IdSinodal3))'
        params.append(docente_id)
    if year_from:
        query += ' AND YEAR(e.FechaTitulacion) >= ?'
        params.append(int(year_from))
    if year_to:
        query += ' AND YEAR(e.FechaTitulacion) <= ?'
        params.append(int(year_to))

    cursor.execute(query, tuple(params))
    estudiantes = []
    
    for idx, row in enumerate(cursor.fetchall()):
        sinodales = [s for s in (row.Sinodal1, row.Sinodal2, row.Sinodal3) if s]
        estudiante = {
            "id": idx, "ncta": row.Ncta, "nombre": row.Nombre,
            "generacion": row.Generacion,
            "fecha_titulacion": str(row.FechaTitulacion) if row.FechaTitulacion else None,
            "carrera": row.Carrera, "facultad": row.Facultad,
            "modalidad": row.Modalidad, "proyecto": row.Proyecto,
            "asesor": row.Asesor, "coasesor": row.Coasesor,
            "sinodales": sinodales
        }
        estudiantes.append(estudiante)

    cursor.close()
    conn.close()
    return jsonify(estudiantes)

# --- Endpoint para agregar un nuevo estudiante ---
@app.route("/api/estudiantes", methods=["POST"])
def add_estudiante():
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Insertar en la tabla Estudiantes
        generacion = f"{data['anio_ingreso']}-{data['anio_egreso']}"
        cursor.execute(
            """
            INSERT INTO Estudiantes (Ncta, Nombre, Generacion, FechaTitulacion, IdCarrera, IdModalidad)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (data['ncta'], data['nombre'], generacion, data['fecha_titulacion'], data['id_carrera'], data['id_modalidad'])
        )

        # Si hay datos de proyecto, insertar en la tabla Proyectos
        if 'proyecto_nombre' in data or 'id_sinodal1' in data:
            cursor.execute(
                """
                INSERT INTO Proyectos (Ncta, Nombre, IdAsesor, IdCoasesor, IdSinodal1, IdSinodal2, IdSinodal3)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (data['ncta'], data.get('proyecto_nombre'), data.get('id_asesor'), data.get('id_coasesor'),
                 data['id_sinodal1'], data['id_sinodal2'], data['id_sinodal3'])
            )
        
        conn.commit()
        return jsonify({"message": "Estudiante agregado exitosamente"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- Endpoint para eliminar un estudiante ---
@app.route("/api/estudiantes/<int:ncta>", methods=["DELETE"])
def delete_estudiante(ncta):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Eliminar primero de Proyectos debido a la clave foránea
        cursor.execute("DELETE FROM Proyectos WHERE Ncta = ?", (ncta,))
        # Eliminar de Estudiantes
        cursor.execute("DELETE FROM Estudiantes WHERE Ncta = ?", (ncta,))
        conn.commit()
        
        if cursor.rowcount > 0:
            return jsonify({"message": "Estudiante eliminado exitosamente"}), 200
        else:
            return jsonify({"message": "Estudiante no encontrado"}), 404
            
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    app.run(debug=True)