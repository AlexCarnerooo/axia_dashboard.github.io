// Configuración de rangos saludables
const healthyRanges = {
    heartRate: { min: 60, max: 100 },
    bloodPressureSystolic: { min: 90, max: 120 },
    bloodPressureDiastolic: { min: 60, max: 80 },
    sleep: { min: 7, max: 9 },
    activity: { min: 7000, max: 10000 }
};

// Inicialización del gráfico
let metricsChart;
let currentMetric = 'heartRate';
const ctx = document.getElementById('metricsGraph').getContext('2d');

// Función para generar datos aleatorios dentro de un rango
function getRandomValue(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para actualizar el estado visual de una métrica
function updateMetricStatus(metricId, value, range) {
    const statusElement = document.getElementById(`${metricId}Status`);
    const isHealthy = value >= range.min && value <= range.max;
    statusElement.className = `status-indicator ${isHealthy ? '' : 'warning'}`;
}

// Función para actualizar el valor de la presión arterial
function updateBloodPressure() {
    const systolic = getRandomValue(healthyRanges.bloodPressureSystolic.min - 10, healthyRanges.bloodPressureSystolic.max + 10);
    const diastolic = getRandomValue(healthyRanges.bloodPressureDiastolic.min - 10, healthyRanges.bloodPressureDiastolic.max + 10);
    document.getElementById('bloodPressureValue').textContent = `${systolic}/${diastolic}`;
    updateMetricStatus('bloodPressure', systolic, healthyRanges.bloodPressureSystolic);
    return { systolic, diastolic };
}

// Función para actualizar el ritmo cardíaco
function updateHeartRate() {
    const value = getRandomValue(healthyRanges.heartRate.min - 10, healthyRanges.heartRate.max + 10);
    document.getElementById('heartRateValue').textContent = value;
    updateMetricStatus('heartRate', value, healthyRanges.heartRate);
    return value;
}

// Inicialización del gráfico
function initChart() {
    const config = {
        type: 'line',
        data: {
            labels: Array(20).fill(''),
            datasets: [{
                label: 'Heart Rate',
                data: [],
                borderColor: '#4f46e5',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    };

    metricsChart = new Chart(ctx, config);
}

// Función para actualizar el gráfico
function updateChart(newValue) {
    const labels = metricsChart.data.labels;
    const data = metricsChart.data.datasets[0].data;

    labels.push('');
    data.push(newValue);

    if (labels.length > 20) {
        labels.shift();
        data.shift();
    }

    metricsChart.update();
}

// Inicialización y actualización periódica
document.addEventListener('DOMContentLoaded', () => {
    initChart();

    // Valores constantes
    document.getElementById('sleepValue').textContent = '7.5';
    document.getElementById('activityValue').textContent = '8500';
    updateMetricStatus('sleep', 7.5, healthyRanges.sleep);
    updateMetricStatus('activity', 8500, healthyRanges.activity);

    // Actualización periódica de métricas variables
    setInterval(() => {
        const heartRate = updateHeartRate();
        updateBloodPressure();
        if (currentMetric === 'heartRate') {
            updateChart(heartRate);
        }
    }, 5000);

    // Event listeners para los botones de métricas
    document.querySelectorAll('.metric-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.metric-button').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            currentMetric = button.dataset.metric;

            // Actualizar el gráfico según la métrica seleccionada
            if (currentMetric === 'heartRate') {
                metricsChart.data.datasets[0].label = 'Heart Rate';
                metricsChart.data.datasets[0].data = [];
            } else if (currentMetric === 'bloodPressure') {
                metricsChart.data.datasets[0].label = 'Blood Pressure';
                metricsChart.data.datasets[0].data = [];
            } else {
                metricsChart.data.datasets[0].data = [];
            }
            metricsChart.update();
        });
    });
}); 