import { useEffect, useRef } from 'react'
import { Chart, ChartConfiguration } from 'chart.js'

interface LineChartProps {
  data: Array<{ timestamp: number, value: number }>
  xAxis: string
  yAxis: string
  className?: string
}

export function LineChart({ 
  data, 
  xAxis, 
  yAxis, 
  className = '' 
}: LineChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current || !data) return

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
        datasets: [{
          label: yAxis,
          data: data.map(d => d.value),
          borderColor: 'rgb(59, 130, 246)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: xAxis
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: yAxis
            }
          }
        }
      }
    }

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    chartInstance.current = new Chart(ctx, config)

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, xAxis, yAxis])

  return (
    <div className={`w-full ${className}`}>
      <canvas ref={chartRef} />
    </div>
  )
}
