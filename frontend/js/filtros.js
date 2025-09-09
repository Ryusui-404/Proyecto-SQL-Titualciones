async function configurarFiltros() {
    await popularSelector('facultad-select', 'facultades', 'Todas las facultades');
    await popularSelector('carrera-select', 'carreras', 'Todas las carreras');
    await popularSelector('docente-select', 'docentes', 'Todos los docentes');

    const facultadSelect = document.getElementById('facultad-select');
    facultadSelect.addEventListener('change', async () => {
        const idFacultad = facultadSelect.value;
        await popularSelector('carrera-select', `carreras?id_facultad=${idFacultad}`, 'Todas las carreras');
        await popularSelector('docente-select', `docentes?id_facultad=${idFacultad}`, 'Todos los docentes');
    });
}

async function popularSelector(selectId, endpoint, defaultOptionText) {
    const select = document.getElementById(selectId);
    select.innerHTML = `<option value="">${defaultOptionText}</option>`;
    const data = await fetchData(endpoint);
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.nombre;
        select.appendChild(option);
    });
}

async function aplicarFiltros() {
    const facultad_id = document.getElementById('facultad-select').value;
    const carrera_id = document.getElementById('carrera-select').value;
    const docente_id = document.getElementById('docente-select').value;
    const year_from = document.getElementById('year-from').value;
    const year_to = document.getElementById('year-to').value;

    let query = 'estudiantes?';
    if (facultad_id) query += `facultad_id=${facultad_id}&`;
    if (carrera_id) query += `carrera_id=${carrera_id}&`;
    if (docente_id) query += `docente_id=${docente_id}&`;
    if (year_from) query += `year_from=${year_from}&`;
    if (year_to) query += `year_to=${year_to}&`;
    
    const datosFiltrados = await fetchData(query);
    actualizarEstudiantes(datosFiltrados);
}

function resetearFiltros() {
    window.location.reload();
}

// Lógica para el formulario de añadir estudiante
async function configurarFormulario() {
    await popularSelector('form-facultad', 'facultades', '-- Seleccione Facultad --');
    await popularSelector('form-modalidad', 'modalidades', '-- Seleccione Modalidad --');
    
    const docentes = await fetchData('docentes');
    const selectoresDocentes = ['form-asesor', 'form-coasesor', 'form-sinodal1', 'form-sinodal2', 'form-sinodal3'];
    selectoresDocentes.forEach(id => {
        const select = document.getElementById(id);
        docentes.forEach(d => {
            const option = document.createElement('option');
            option.value = d.id;
            option.textContent = d.nombre;
            select.appendChild(option);
        });
    });

    document.getElementById('form-facultad').addEventListener('change', async (e) => {
        await popularSelector('form-carrera', `carreras?id_facultad=${e.target.value}`, '-- Seleccione Carrera --');
    });

    const modalidadSelect = document.getElementById('form-modalidad');
    const projectDetails = document.getElementById('project-details');
    const proyectoNombre = document.getElementById('proyecto-nombre');
    const asesorSelects = [document.getElementById('form-asesor'), document.getElementById('form-coasesor')];
    
    modalidadSelect.addEventListener('change', async (e) => {
        const modalidades = await fetchData('modalidades');
        const modalidadSeleccionada = modalidades.find(m => m.id === e.target.value);
        const nombreModalidad = modalidadSeleccionada ? modalidadSeleccionada.nombre : '';

        const noRequiereProyecto = ['EGEL', 'Desempeño Académico Sobresaliente', 'Certificación'];
        const esDiplomado = nombreModalidad === 'Posgrado - Diplomado';

        if (noRequiereProyecto.includes(nombreModalidad)) {
            projectDetails.classList.add('hidden');
        } else {
            projectDetails.classList.remove('hidden');
            proyectoNombre.style.display = 'block';
            asesorSelects.forEach(s => s.style.display = 'block');

            if (esDiplomado) {
                proyectoNombre.style.display = 'none';
                asesorSelects.forEach(s => s.style.display = 'none');
            }
        }
    });

    document.getElementById('add-student-form').addEventListener('submit', handleAddStudent);
}


async function handleAddStudent(event) {
    event.preventDefault();
    const modalidadId = document.getElementById('form-modalidad').value;
    const modalidades = await fetchData('modalidades');
    const modalidadSeleccionada = modalidades.find(m => m.id === modalidadId);
    const nombreModalidad = modalidadSeleccionada ? modalidadSeleccionada.nombre : '';
    
    // Validación de sinodales
    const asesor = document.getElementById('form-asesor').value;
    const coasesor = document.getElementById('form-coasesor').value;
    const sinodal1 = document.getElementById('form-sinodal1').value;
    const sinodal2 = document.getElementById('form-sinodal2').value;
    const sinodal3 = document.getElementById('form-sinodal3').value;

    if (asesor && (asesor === sinodal1 || asesor === sinodal2)) {
        alert('El Asesor no puede ser Presidente ni Secretario.');
        return;
    }
     if (coasesor && (coasesor === sinodal1 || coasesor === sinodal2)) {
        alert('El Co-asesor no puede ser Presidente ni Secretario.');
        return;
    }

    const nuevoEstudiante = {
        ncta: parseInt(document.getElementById('ncta').value),
        nombre: document.getElementById('nombre').value,
        anio_ingreso: parseInt(document.getElementById('anio-ingreso').value),
        anio_egreso: parseInt(document.getElementById('anio-egreso').value),
        fecha_titulacion: document.getElementById('fecha-titulacion').value,
        id_carrera: document.getElementById('form-carrera').value,
        id_modalidad: modalidadId,
        proyecto_nombre: document.getElementById('proyecto-nombre').value || null,
        id_asesor: asesor || null,
        id_coasesor: coasesor || null,
        id_sinodal1: sinodal1,
        id_sinodal2: sinodal2,
        id_sinodal3: sinodal3,
    };
    
    // Limpiar datos de proyecto si no son necesarios
    const noRequiereProyecto = ['EGEL', 'Desempeño Académico Sobresaliente', 'Certificación'];
    if (noRequiereProyecto.includes(nombreModalidad)) {
        delete nuevoEstudiante.proyecto_nombre;
        delete nuevoEstudiante.id_asesor;
        delete nuevoEstudiante.id_coasesor;
        delete nuevoEstudiante.id_sinodal1;
        delete nuevoEstudiante.id_sinodal2;
        delete nuevoEstudiante.id_sinodal3;
    } else if (nombreModalidad === 'Posgrado - Diplomado') {
        nuevoEstudiante.id_asesor = null;
        nuevoEstudiante.id_coasesor = null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/estudiantes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoEstudiante),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            document.getElementById('add-student-form').reset();
            aplicarFiltros(); // Recargar la lista
        } else {
            throw new Error(result.error || 'Error al agregar estudiante');
        }
    } catch (error) {
        console.error('Error:', error);
        alert(`No se pudo agregar el estudiante: ${error.message}`);
    }
}