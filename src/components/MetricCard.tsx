import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid'

interface MetricCardProps {
  title: string
  value: string | number
  data: any[]
  dataKey: string
  icon: React.ElementType
  color: string
  bgColor: string
  isHealthy: boolean
}

export default function MetricCard({
  title,
  value,
  data,
  dataKey,
  icon: Icon,
  color,
  bgColor,
  isHealthy
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-transform hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`${bgColor} p-3 rounded-full`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">{title}</h3>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold">{value}</p>
              {isHealthy ? (
                <CheckCircleIcon className="h-6 w-6 text-green-500" />
              ) : (
                <ExclamationCircleIcon className="h-6 w-6 text-red-500 animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color.replace('text-', '#')}
              strokeWidth={2}
              dot={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 