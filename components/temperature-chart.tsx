"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/helpers/axiosInstance"
import { RefreshCw } from "lucide-react"

interface TemperatureHumidityData {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: string | null
  temperature: number
  humidity: number
}

interface TransformedData {
  time: string
  temperature: number
  humidity: number
  originalTimestamp: string
  id: number
}

const fetchTemperatureData = async (): Promise<TransformedData[]> => {
  const response = await apiClient.get<TemperatureHumidityData[]>('/temp-humidity')
  
  const transformedData = response.data.map((item) => ({
    time: new Date(item.CreatedAt).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }),
    temperature: item.temperature || 0,
    humidity: item.humidity || 0,
    originalTimestamp: item.CreatedAt,
    id: item.ID
  }))

  // Sort by timestamp (oldest first for proper time series)
  transformedData.sort((a, b) => {
    return new Date(a.originalTimestamp).getTime() - new Date(b.originalTimestamp).getTime()
  })

  return transformedData
}

export function TemperatureChart() {
  const {
    data: apiData = [],
    isLoading,
    error,
    isError,
    refetch,
    isFetching
  } = useQuery({
    queryKey: ['temperatureData'],
    queryFn: fetchTemperatureData,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  // Get last 24 data points for 24-hour chart
  const temperatureData = apiData.slice(-24)

  // Calculate weekly data from API data
  const weeklyData = (() => {
    if (!apiData || apiData.length === 0) return []
    
    const last7Days = apiData.slice(-168) // Assuming hourly data for 7 days
    const groupedByDay: { [key: string]: { high: number; low: number; day: string; date: Date } } = {}
    
    last7Days.forEach((item) => {
      const date = new Date(item.originalTimestamp)
      
      // Check if date is valid
      if (isNaN(date.getTime())) return
      
      const dayKey = date.toISOString().split('T')[0] // Use date as key (YYYY-MM-DD)
      const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
      
      if (!groupedByDay[dayKey]) {
        groupedByDay[dayKey] = {
          day: dayName,
          high: item.temperature,
          low: item.temperature,
          date: date
        }
      } else {
        groupedByDay[dayKey].high = Math.max(groupedByDay[dayKey].high, item.temperature)
        groupedByDay[dayKey].low = Math.min(groupedByDay[dayKey].low, item.temperature)
      }
    })
    
    // Sort by date and return only the data needed for the chart
    return Object.values(groupedByDay)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map(({ day, high, low }) => ({ day, high, low }))
      .slice(-7) // Last 7 days
  })()

  const currentConditions = apiData && apiData.length > 0 
    ? apiData[apiData.length - 1]
    : { temperature: 0, humidity: 0 }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-card-foreground">24-Hour Temperature Monitoring</CardTitle>
            <CardDescription>Loading temperature and humidity data...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="animate-spin h-5 w-5 border-2 border-green-500 border-t-transparent rounded-full"></div>
                <span className="text-muted-foreground">Loading...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-card-foreground">24-Hour Temperature Monitoring</CardTitle>
            <CardDescription>Error loading temperature data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full flex flex-col items-center justify-center space-y-4">
              <div className="text-red-500 text-center">
                {error?.response?.data?.message || error?.message || 'Failed to fetch temperature data'}
              </div>
              <button 
                onClick={() => void refetch()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                Try Again
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!apiData || apiData.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-card-foreground">24-Hour Temperature Monitoring</CardTitle>
            <CardDescription>No temperature data available</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full flex flex-col items-center justify-center space-y-4">
              <div className="text-muted-foreground">No data available</div>
              <button 
                onClick={() => void refetch()}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-card-foreground">24-Hour Temperature Monitoring</CardTitle>
              <CardDescription>
                Temperature and humidity monitoring ({apiData.length} data points)
              </CardDescription>
            </div>
            <button 
              onClick={() => void refetch()}
              disabled={isFetching}
              className="px-3 py-1.5 text-sm bg-green-600/10 hover:bg-green-600/20 text-green-600 border border-green-600/20 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isFetching ? (
                <>
                  <div className="animate-spin h-3 w-3 border-2 border-green-600 border-t-transparent rounded-full"></div>
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-3 w-3" />
                  Refresh
                </>
              )}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={temperatureData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 197, 94, 0.1)" />
                <XAxis dataKey="time" stroke="rgba(156, 163, 175, 0.8)" fontSize={12} />
                <YAxis
                  yAxisId="temp"
                  stroke="rgba(156, 163, 175, 0.8)"
                  fontSize={12}
                  domain={["dataMin - 2", "dataMax + 2"]}
                />
                <YAxis
                  yAxisId="humidity"
                  orientation="right"
                  stroke="rgba(156, 163, 175, 0.8)"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                  formatter={(value, name) => {
                    if (name === "Temperature (°C)") {
                      return [`Temperature : ${value}°C`, '']
                    }
                    if (name === "Humidity (%)") {
                      return [`Humidity : ${value}%`, '']
                    }
                    return [value, name]
                  }}
                  labelFormatter={(label) => label}
                />
                <Legend />
                <Area
                  yAxisId="temp"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#temperatureGradient)"
                  name="Temperature (°C)"
                />
                <Line
                  yAxisId="humidity"
                  type="monotone"
                  dataKey="humidity"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: "#10b981", strokeWidth: 2 }}
                  name="Humidity (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-card-foreground">Weekly Temperature Range</CardTitle>
            <CardDescription>High and low temperatures</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 197, 94, 0.1)" />
                  <XAxis dataKey="day" stroke="rgba(156, 163, 175, 0.8)" fontSize={12} />
                  <YAxis stroke="rgba(156, 163, 175, 0.8)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(34, 197, 94, 0.3)",
                      borderRadius: "8px",
                      color: "white",
                    }}
                    formatter={(value, name) => [`${value}°C`, name === "high" ? "High" : "Low"]}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="high"
                    stroke="#22c55e"
                    strokeWidth={2}
                    dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                    name="High"
                  />
                  <Line
                    type="monotone"
                    dataKey="low"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    name="Low"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-card-foreground">Current Conditions</CardTitle>
            <CardDescription>Real-time environmental data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {currentConditions.temperature}°C
                </div>
                <div className="text-sm text-muted-foreground">Current Temperature</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Humidity</span>
                  <span className="text-sm text-green-400">
                    {currentConditions.humidity}%
                  </span>
                </div>
                <div className="w-full bg-green-900/20 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full"
                    style={{ width: `${currentConditions.humidity}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}