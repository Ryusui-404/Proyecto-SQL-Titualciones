function generarGraficas(datos = estudiantes) {
    // Destruir gráficas existentes
    if (chartModalidad) chartModalidad.destroy();
    if (chartYear) chartYear.destroy();
    if (chartCarrera) chartCarrera.destroy();
    if (chartMonth) chartMonth.destroy();
    
    // Generar nuevas gráficas
    generarGraficaModalidades(datos);
    generarGraficaPorAño(datos);
    generarGraficaCarreras(datos);
    generarGraficaPorMes(datos);
}

// Generar gráfica de modalidades por facultad
function generarGraficaModalidades(datos) {
    const ctx = document.getElementById('modalidad-chart').getContext('2d');
    
    // Agrupar datos por facultad y modalidad
    const facultades = [...new Set(datos.map(e => e.facultad))].filter(f => f);
    const modalidades = [...new Set(datos.map(e => e.modalidad))].filter(m => m);
    
    const datasets = modalidades.map(modalidad => {
        return {
            label: modalidad,
            data: facultades.map(facultad => {
                return datos.filter(e => e.facultad === facultad && e.modalidad === modalidad).length;
            }),
            backgroundColor: getColor(modalidad)
        };
    });
    
    chartModalidad = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: facultades,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    stacked: true
                },
                y: {
                    stacked: true,
                    beginAtZero: true
                }
            }
        }
    });
}

// Generar gráfica de titulados por año
function generarGraficaPorAño(datos) {
    const ctx = document.getElementById('year-chart').getContext('2d');
    
    // Obtener años con datos
    const años = [];
    datos.forEach(e => {
        if (e.fecha_titulacion) {
            const year = new Date(e.fecha_titulacion).getFullYear();
            if (!años.includes(year)) años.push(year);
        }
    });
    
    años.sort();
    
    // Contar estudiantes por año
    const conteoPorAño = años.map(year => {
        return datos.filter(e => {
            if (!e.fecha_titulacion) return false;
            return new Date(e.fecha_titulacion).getFullYear() === year;
        }).length;
    });
    
    chartYear = new Chart(ctx, {
        type: 'line',
        data: {
            labels: años,
            datasets: [{
                label: 'Estudiantes titulados',
                data: conteoPorAño,
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                borderColor: 'rgba(52, 152, 219, 1)',
                borderWidth: 2,
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Generar gráfica de distribución por carrera
function generarGraficaCarreras(datos) {
    const ctx = document.getElementById('carrera-chart').getContext('2d');
    
    // Agrupar por carrera
    const carreras = [...new Set(datos.map(e => e.carrera))].filter(c => c);
    const conteoPorCarrera = carreras.map(carrera => {
        return datos.filter(e => e.carrera === carrera).length;
    });
    
    chartCarrera = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: carreras,
            datasets: [{
                data: conteoPorCarrera,
                backgroundColor: carreras.map((_, i) => getColor(i))
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

// Generar gráfica de titulados por mes
function generarGraficaPorMes(datos) {
    const ctx = document.getElementById('month-chart').getContext('2d');
    
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const conteoPorMes = new Array(12).fill(0);
    
    datos.forEach(e => {
        if (e.fecha_titulacion) {
            const month = new Date(e.fecha_titulacion).getMonth();
            conteoPorMes[month]++;
        }
    });
    
    chartMonth = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: meses,
            datasets: [{
                label: 'Titulaciones por mes',
                data: conteoPorMes,
                backgroundColor: 'rgba(231, 76, 60, 0.7)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}