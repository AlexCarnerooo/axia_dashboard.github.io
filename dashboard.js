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
let historicalData = {
    heartRate: [],
    bloodPressure: [],
    timestamps: []
};

// Función para generar datos más dinámicos
function getRandomValue(min, max, previousValue = null) {
    if (previousValue === null) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Generar una tendencia aleatoria
    const trend = Math.random() > 0.5 ? 1 : -1;
    const maxChange = (max - min) * 0.15; // Permite cambios de hasta 15%
    const change = Math.random() * maxChange * trend;
    
    let newValue = previousValue + change;
    // Asegurar que el valor esté dentro de los límites
    if (newValue < min) newValue = min + Math.random() * maxChange;
    if (newValue > max) newValue = max - Math.random() * maxChange;
    
    return Math.round(newValue);
}

// Función para actualizar el estado visual de una métrica
function updateMetricStatus(metricId, value, range) {
    const statusElement = document.getElementById(`${metricId}Status`);
    const isHealthy = value >= range.min && value <= range.max;
    statusElement.className = `status-indicator ${isHealthy ? '' : 'warning'}`;
}

// Función para actualizar el valor de la presión arterial
function updateBloodPressure() {
    const lastSystolic = historicalData.bloodPressure.length > 0 ? 
        historicalData.bloodPressure[historicalData.bloodPressure.length - 1] : null;
    
    const systolic = getRandomValue(
        healthyRanges.bloodPressureSystolic.min - 15,
        healthyRanges.bloodPressureSystolic.max + 15,
        lastSystolic
    );
    const diastolic = Math.round(systolic * 0.65 + Math.random() * 10);
    
    document.getElementById('bloodPressureValue').textContent = `${systolic}/${diastolic}`;
    updateMetricStatus('bloodPressure', systolic, healthyRanges.bloodPressureSystolic);
    
    historicalData.bloodPressure.push(systolic);
    if (historicalData.bloodPressure.length > 20) {
        historicalData.bloodPressure.shift();
    }
    
    return { systolic, diastolic };
}

// Función para actualizar el ritmo cardíaco
function updateHeartRate() {
    const lastHeartRate = historicalData.heartRate.length > 0 ? 
        historicalData.heartRate[historicalData.heartRate.length - 1] : null;
    
    const value = getRandomValue(
        healthyRanges.heartRate.min - 10,
        healthyRanges.heartRate.max + 20,
        lastHeartRate
    );
    
    document.getElementById('heartRateValue').textContent = value;
    updateMetricStatus('heartRate', value, healthyRanges.heartRate);
    
    historicalData.heartRate.push(value);
    if (historicalData.heartRate.length > 20) {
        historicalData.heartRate.shift();
    }
    
    return value;
}

// Inicialización del gráfico
function initChart() {
    const ctx = document.getElementById('metricsGraph').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');

    const config = {
        type: 'line',
        data: {
            labels: Array(20).fill(''),
            datasets: [{
                label: 'Heart Rate',
                data: [],
                borderColor: '#4f46e5',
                backgroundColor: gradient,
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#4f46e5',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 6
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
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            animation: {
                duration: 750,
                easing: 'easeInOutQuart'
            }
        }
    };

    metricsChart = new Chart(ctx, config);
}

// Función para actualizar el gráfico
function updateChart() {
    const data = currentMetric === 'heartRate' ? historicalData.heartRate : 
                 currentMetric === 'bloodPressure' ? historicalData.bloodPressure : [];

    const ctx = document.getElementById('metricsGraph').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    
    if (currentMetric === 'heartRate') {
        gradient.addColorStop(0, 'rgba(79, 70, 229, 0.2)');
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');
        metricsChart.data.datasets[0].borderColor = '#4f46e5';
        metricsChart.data.datasets[0].backgroundColor = gradient;
    } else if (currentMetric === 'bloodPressure') {
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.2)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        metricsChart.data.datasets[0].borderColor = '#ef4444';
        metricsChart.data.datasets[0].backgroundColor = gradient;
    }

    metricsChart.data.datasets[0].data = data;
    metricsChart.update('none');
}

// Función para actualizar la hora actual
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('currentTime').textContent = timeString;
}

// Inicialización y actualización periódica
document.addEventListener('DOMContentLoaded', () => {
    initChart();
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);

    // Valores constantes
    document.getElementById('sleepValue').textContent = '7.5';
    document.getElementById('activityValue').textContent = '8500';
    updateMetricStatus('sleep', 7.5, healthyRanges.sleep);
    updateMetricStatus('activity', 8500, healthyRanges.activity);

    // Primera actualización de datos
    updateHeartRate();
    updateBloodPressure();

    // Actualización periódica más frecuente
    setInterval(() => {
        updateHeartRate();
        updateBloodPressure();
        updateChart();
    }, 2000);

    // Event listeners para los botones de métricas
    document.querySelectorAll('.metric-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.metric-button').forEach(b => {
                b.classList.remove('active', 'bg-indigo-600', 'text-white');
                b.classList.add('bg-gray-100', 'text-gray-700');
            });
            button.classList.remove('bg-gray-100', 'text-gray-700');
            button.classList.add('active', 'bg-indigo-600', 'text-white');
            currentMetric = button.dataset.metric;

            if (currentMetric === 'heartRate') {
                metricsChart.data.datasets[0].label = 'Ritmo Cardíaco';
            } else if (currentMetric === 'bloodPressure') {
                metricsChart.data.datasets[0].label = 'Presión Arterial';
            }

            updateChart();
        });
    });
}); 