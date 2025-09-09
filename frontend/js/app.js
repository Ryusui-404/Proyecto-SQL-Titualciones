let estudiantes = [];
let chartModalidad, chartYear, chartCarrera, chartMonth;

const API_BASE_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    configurarFiltros();
    configurarFormulario();
    configurarTablaListener();

    aplicarFiltros(); 

    document.getElementById('apply-filters').addEventListener('click', aplicarFiltros);
    document.getElementById('reset-filters').addEventListener('click', resetearFiltros);
});

function configurarTablaListener() {
    const studentsTbody = document.getElementById('students-list');

    studentsTbody.addEventListener('click', (event) => {
        const target = event.target;

        if (target.classList.contains('toggle-details')) {
            const id = target.dataset.id;
            const details = document.getElementById(`details-${id}`);
            if (details) {
                details.classList.toggle('active');
                target.textContent = details.classList.contains('active') ? '−' : '+';
            }
        }
        if (target.classList.contains('delete-btn')) {
            const ncta = target.dataset.ncta;
            handleDeleteStudent(ncta);
        }
    });
}


async function fetchData(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`);
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error al cargar datos desde ${endpoint}:`, error);
        alert('No se pudieron cargar los datos. Verifica que el servidor esté en ejecución.');
        return [];
    }
}

function getColor(value) {
    const colors = [
        'rgba(52, 152, 219, 0.7)', 'rgba(46, 204, 113, 0.7)',
        'rgba(231, 76, 60, 0.7)', 'rgba(241, 196, 15, 0.7)',
        'rgba(155, 89, 182, 0.7)', 'rgba(52, 73, 94, 0.7)',
        'rgba(26, 188, 156, 0.7)', 'rgba(230, 126, 34, 0.7)',
        'rgba(236, 240, 241, 0.7)', 'rgba(149, 165, 166, 0.7)'
    ];
    if (typeof value === 'string') {
        let hash = 0;
        for (let i = 0; i < value.length; i++) {
            hash = value.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }
    return colors[value % colors.length];
}

function actualizarEstudiantes(nuevosEstudiantes) {
    estudiantes = nuevosEstudiantes;
    generarGraficas(estudiantes);
    mostrarListaEstudiantes(estudiantes);

}
