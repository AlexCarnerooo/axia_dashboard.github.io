import { useState, useEffect } from 'react'
import { HeartIcon, MoonIcon, ChartBarIcon, BellIcon, FireIcon } from '@heroicons/react/24/outline'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import MetricCard from './components/MetricCard'

// Función para generar datos aleatorios con fluctuación más suave
const generateRandomValue = (min: number, max: number, previousValue?: number) => {
  if (previousValue !== undefined) {
    // Generar una fluctuación del ±3% del rango para cambios más suaves
    const fluctuation = ((max - min) * 0.03)
    const newMin = Math.max(min, previousValue - fluctuation)
    const newMax = Math.min(max, previousValue + fluctuation)
    return Math.floor(Math.random() * (newMax - newMin + 1)) + newMin
  }
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Función para verificar si un valor está dentro de rangos saludables
const isHealthyValue = (metric: string, value: number) => {
  const healthyRanges = {
    heartRate: { min: 60, max: 100 },
    bloodPressure: { min: 90, max: 120 },
    sleep: { min: 6, max: 9 },
    activity: { min: 5000, max: 10000 }
  }
  const range = healthyRanges[metric as keyof typeof healthyRanges]
  return value >= range.min && value <= range.max
}

function App() {
  const [selectedMetric, setSelectedMetric] = useState('heartRate')
  const [currentData, setCurrentData] = useState<any[]>([])
  const [latestValues, setLatestValues] = useState({
    heartRate: 75,
    bloodPressure: 120,
    sleep: 7.5,
    activity: 8500
  })

  // Efecto para actualizar los datos cada 5 segundos
  useEffect(() => {
    const updateData = () => {
      const now = new Date()
      const newDataPoint = {
        time: now.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit' 
        }),
        heartRate: generateRandomValue(55, 105, latestValues.heartRate),
        bloodPressure: generateRandomValue(85, 125, latestValues.bloodPressure),
        sleep: latestValues.sleep, // Mantener constante
        activity: latestValues.activity // Mantener constante
      }

      setCurrentData(prevData => {
        const newData = [...prevData, newDataPoint]
        return newData.slice(-20) // Mantener solo los últimos 20 puntos para una vista más clara
      })

      setLatestValues(prev => ({
        ...prev, // Mantener los valores constantes
        heartRate: newDataPoint.heartRate,
        bloodPressure: newDataPoint.bloodPressure
      }))
    }

    updateData() // Actualizar inmediatamente
    const interval = setInterval(updateData, 5000) // Actualizar cada 5 segundos
    return () => clearInterval(interval)
  }, [])

  // Determinar si mostrar el gráfico basado en la métrica seleccionada
  const showGraph = selectedMetric === 'heartRate' || selectedMetric === 'bloodPressure'

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-axia-blue text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/axia-icon.svg" alt="AXIA" className="h-8 w-8" />
            <h1 className="text-2xl font-bold">AXIA Dashboard</h1>
          </div>
          <div className="flex space-x-4">
            <button className="p-2 hover:bg-axia-light hover:text-axia-blue rounded-full transition-colors">
              <BellIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Frecuencia Cardíaca"
            value={`${latestValues.heartRate} bpm`}
            data={currentData}
            dataKey="heartRate"
            icon={HeartIcon}
            color="text-red-600"
            bgColor="bg-red-100"
            isHealthy={isHealthyValue('heartRate', latestValues.heartRate)}
          />

          <MetricCard
            title="Presión Arterial"
            value={`${latestValues.bloodPressure}/80`}
            data={currentData}
            dataKey="bloodPressure"
            icon={ChartBarIcon}
            color="text-blue-600"
            bgColor="bg-blue-100"
            isHealthy={isHealthyValue('bloodPressure', latestValues.bloodPressure)}
          />

          <MetricCard
            title="Calidad del Sueño"
            value={`${latestValues.sleep}h`}
            data={[{ sleep: latestValues.sleep }]}
            dataKey="sleep"
            icon={MoonIcon}
            color="text-purple-600"
            bgColor="bg-purple-100"
            isHealthy={isHealthyValue('sleep', latestValues.sleep)}
          />

          <MetricCard
            title="Actividad Diaria"
            value={`${latestValues.activity.toLocaleString()} pasos`}
            data={[{ activity: latestValues.activity }]}
            dataKey="activity"
            icon={FireIcon}
            color="text-orange-600"
            bgColor="bg-orange-100"
            isHealthy={isHealthyValue('activity', latestValues.activity)}
          />
        </div>

        {/* Detailed Metrics Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Métricas Detalladas</h2>
          {showGraph ? (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      border: 'none',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey={selectedMetric}
                    stroke="#0066CC"
                    strokeWidth={2}
                    dot={false}
                    animationDuration={300}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-gray-500">
              Esta métrica no fluctúa en tiempo real
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button
              onClick={() => setSelectedMetric('heartRate')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedMetric === 'heartRate'
                  ? 'bg-axia-blue text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Frecuencia Cardíaca
            </button>
            <button
              onClick={() => setSelectedMetric('bloodPressure')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedMetric === 'bloodPressure'
                  ? 'bg-axia-blue text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Presión Arterial
            </button>
            <button
              onClick={() => setSelectedMetric('sleep')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedMetric === 'sleep'
                  ? 'bg-axia-blue text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Sueño
            </button>
            <button
              onClick={() => setSelectedMetric('activity')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedMetric === 'activity'
                  ? 'bg-axia-blue text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              Actividad Diaria
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App 