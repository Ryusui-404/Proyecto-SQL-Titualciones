// Función para mostrar la lista de estudiantes
function mostrarListaEstudiantes(datos = estudiantes) {
    const tbody = document.getElementById('students-list');
    tbody.innerHTML = ''; // Limpiar la tabla

    if (datos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No se encontraron registros con los filtros seleccionados.</td></tr>';
        return;
    }

    datos.forEach(estudiante => {
        const row = document.createElement('tr');
        const fechaFormateada = estudiante.fecha_titulacion
            ? new Date(estudiante.fecha_titulacion).toLocaleDateString()
            : 'No disponible';

        row.innerHTML = `
            <td><button class="toggle-details" data-id="${estudiante.id}">+</button></td>
            <td>${estudiante.ncta}</td>
            <td>${estudiante.nombre}</td>
            <td>${estudiante.carrera || 'N/A'}</td>
            <td>${estudiante.facultad || 'N/A'}</td>
            <td>${estudiante.generacion || 'N/A'}</td>
            <td>${fechaFormateada}</td>
            <td>
                <button class="delete-btn" data-ncta="${estudiante.ncta}">Eliminar</button>
            </td>
        `;

        const detailsRow = document.createElement('tr');
        detailsRow.classList.add('student-details');
        detailsRow.id = `details-${estudiante.id}`;
        detailsRow.innerHTML = `
            <td colspan="8">
                <div class="details-content">
                    <p><strong>Modalidad:</strong> ${estudiante.modalidad || 'N/A'}</p>
                    <p><strong>Proyecto:</strong> ${estudiante.proyecto || 'N/A'}</p>
                    <p><strong>Asesor:</strong> ${estudiante.asesor || 'N/A'}</p>
                    <p><strong>Coasesor:</strong> ${estudiante.coasesor || 'N/A'}</p>
                    <p><strong>Sinodales:</strong> ${(estudiante.sinodales && estudiante.sinodales.length > 0) ? estudiante.sinodales.join(', ') : 'N/A'}</p>
                </div>
            </td>
        `;

        tbody.appendChild(row);
        tbody.appendChild(detailsRow);
    });
}

// La función para eliminar se queda igual
async function handleDeleteStudent(ncta) {
    const confirmacion = confirm(`¿Estás seguro de eliminar el registro del estudiante con cuenta ${ncta}?`);
    if (confirmacion) {
        try {
            const response = await fetch(`${API_BASE_URL}/estudiantes/${ncta}`, {
                method: 'DELETE',
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                aplicarFiltros(); // Recargar la lista
            } else {
                throw new Error(result.error || 'Error desconocido');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            alert(`No se pudo eliminar el registro: ${error.message}`);
        }
    }
}