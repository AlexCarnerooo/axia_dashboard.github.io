// Configuración de rangos saludables
const healthyRanges = {
    heartRate: { min: 60, max: 100 },
    bloodPressureSystolic: { min: 90, max: 120 },
    bloodPressureDiastolic: { min: 60, max: 80 },
    sleep: { min: 7, max: 9 },
    activity: { min: 7000, max: 10000 }
};

// Variables para el gráfico y datos históricos
let metricsChart;
let currentMetric = 'heartRate';
let historicalData = {
    heartRate: Array(20).fill(80),
    bloodPressure: Array(20).fill(100),
    sleep: Array(20).fill(7.5),
    activity: Array(20).fill(8500),
    timestamps: Array(20).fill('')
};

// Valores actuales para mantener la continuidad
let currentValues = {
    heartRate: 80,
    bloodPressure: { systolic: 100, diastolic: 70 },
    sleep: 7.5,
    activity: 8500
};

// Función para generar datos más dinámicos
function getRandomValue(min, max, previousValue = null, isDecimal = false) {
    if (previousValue === null) {
        const value = Math.random() * (max - min) + min;
        return isDecimal ? Number(value.toFixed(1)) : Math.round(value);
    }
    
    const trend = Math.random() > 0.5 ? 1 : -1;
    const maxChange = (max - min) * 0.05; // Cambio más suave del 5%
    const change = Math.random() * maxChange * trend;
    
    let newValue = previousValue + change;
    if (newValue < min) newValue = min + Math.random() * maxChange;
    if (newValue > max) newValue = max - Math.random() * maxChange;
    
    return isDecimal ? Number(newValue.toFixed(1)) : Math.round(newValue);
}

// Función para actualizar el estado visual de una métrica
function updateMetricStatus(metricId, value, range) {
    const statusElement = document.getElementById(`${metricId}Status`);
    const isHealthy = value >= range.min && value <= range.max;
    statusElement.className = `status-indicator${isHealthy ? '' : ' warning'}`;
}

// Función para actualizar el sueño
function updateSleep() {
    currentValues.sleep = getRandomValue(
        healthyRanges.sleep.min - 1,
        healthyRanges.sleep.max + 1,
        currentValues.sleep,
        true
    );
    
    document.getElementById('sleepValue').textContent = currentValues.sleep;
    updateMetricStatus('sleep', currentValues.sleep, healthyRanges.sleep);
    
    historicalData.sleep = [...historicalData.sleep.slice(1), currentValues.sleep];
    
    return currentValues.sleep;
}

// Función para actualizar la actividad
function updateActivity() {
    currentValues.activity = getRandomValue(
        healthyRanges.activity.min - 1000,
        healthyRanges.activity.max + 1000,
        currentValues.activity
    );
    
    document.getElementById('activityValue').textContent = currentValues.activity;
    updateMetricStatus('activity', currentValues.activity, healthyRanges.activity);
    
    historicalData.activity = [...historicalData.activity.slice(1), currentValues.activity];
    
    return currentValues.activity;
}

// Función para actualizar el valor de la presión arterial
function updateBloodPressure() {
    currentValues.bloodPressure.systolic = getRandomValue(
        healthyRanges.bloodPressureSystolic.min - 15,
        healthyRanges.bloodPressureSystolic.max + 15,
        currentValues.bloodPressure.systolic
    );
    
    currentValues.bloodPressure.diastolic = Math.round(currentValues.bloodPressure.systolic * 0.65 + Math.random() * 10);
    
    document.getElementById('bloodPressureValue').textContent = 
        `${currentValues.bloodPressure.systolic}/${currentValues.bloodPressure.diastolic}`;
    updateMetricStatus('bloodPressure', currentValues.bloodPressure.systolic, healthyRanges.bloodPressureSystolic);
    
    historicalData.bloodPressure = [...historicalData.bloodPressure.slice(1), currentValues.bloodPressure.systolic];
    
    return currentValues.bloodPressure;
}

// Función para actualizar el ritmo cardíaco
function updateHeartRate() {
    currentValues.heartRate = getRandomValue(
        healthyRanges.heartRate.min - 10,
        healthyRanges.heartRate.max + 20,
        currentValues.heartRate
    );
    
    document.getElementById('heartRateValue').textContent = currentValues.heartRate;
    updateMetricStatus('heartRate', currentValues.heartRate, healthyRanges.heartRate);
    
    historicalData.heartRate = [...historicalData.heartRate.slice(1), currentValues.heartRate];
    
    return currentValues.heartRate;
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
                label: 'Ritmo Cardíaco',
                data: historicalData.heartRate,
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
    let data;
    let color;
    let label;
    
    switch(currentMetric) {
        case 'heartRate':
            data = historicalData.heartRate;
            color = '#4f46e5';
            label = 'Ritmo Cardíaco';
            break;
        case 'bloodPressure':
            data = historicalData.bloodPressure;
            color = '#ef4444';
            label = 'Presión Arterial';
            break;
        case 'sleep':
            data = historicalData.sleep;
            color = '#10b981';
            label = 'Calidad del Sueño';
            break;
        case 'activity':
            data = historicalData.activity;
            color = '#f59e0b';
            label = 'Actividad Diaria';
            break;
        default:
            data = [];
            color = '#4f46e5';
            label = '';
    }

    const ctx = document.getElementById('metricsGraph').getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, `${color}33`);
    gradient.addColorStop(1, `${color}00`);

    metricsChart.data.datasets[0].label = label;
    metricsChart.data.datasets[0].data = data;
    metricsChart.data.datasets[0].borderColor = color;
    metricsChart.data.datasets[0].backgroundColor = gradient;
    metricsChart.data.datasets[0].pointBackgroundColor = color;

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
    // Inicializar el gráfico
    initChart();

    // Primera actualización de datos
    updateHeartRate();
    updateBloodPressure();
    updateSleep();
    updateActivity();
    updateChart();

    // Actualización periódica
    setInterval(() => {
        updateHeartRate();
        updateBloodPressure();
        updateSleep();
        updateActivity();
        updateChart();
    }, 2000);

    // Event listeners para los botones de métricas
    document.querySelectorAll('.metric-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.metric-button').forEach(b => {
                b.classList.remove('active');
            });
            button.classList.add('active');
            currentMetric = button.dataset.metric;
            updateChart();
        });
    });
}); 