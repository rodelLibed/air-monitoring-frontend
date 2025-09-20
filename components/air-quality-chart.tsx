"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

import { apiClient } from "@/helpers/axiosInstance"

// Type definitions
interface ApiResponse {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  DeletedAt: string | null
  gas_value: number
  air_quality: string
}

interface TransformedData {
  time: string
  gas_value: number
  air_quality: string
  air_quality_numeric: number
  originalTimestamp: string
  id: number
}

// API function
const fetchAirQualityData = async (): Promise<TransformedData[]> => {
  const response = await apiClient.get<ApiResponse[]>('/air-monitoring-sensor')
  
  // Transform the API data to match the chart format
  const transformedData = response.data.map((item: ApiResponse) => ({
    time: new Date(item.CreatedAt).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }),
    gas_value: item.gas_value || 0,
    air_quality: item.air_quality || 'Unknown',
    air_quality_numeric: item.air_quality === 'Poor' ? 2 : item.air_quality === 'Normal' ? 1 : 0,
    originalTimestamp: item.CreatedAt,
    id: item.ID
  }))

  // Sort by timestamp (oldest first for proper time series)
  transformedData.sort((a: TransformedData, b: TransformedData) => {
    return new Date(a.originalTimestamp).getTime() - new Date(b.originalTimestamp).getTime()
  })

  return transformedData
}

export function AirQualityChart() {
  const {
    data: airQualityData = [],
    isLoading,
    error,
    isError,
    refetch
  } = useQuery({
    queryKey: ['airQualityData'],
    queryFn: fetchAirQualityData,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when network reconnects
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 2 * 60 * 1000, // Data is fresh for 2 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes (formerly cacheTime)
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-card-foreground">Air Quality Index (AQI) Trends</CardTitle>
            <CardDescription>Loading real-time gas sensor data...</CardDescription>
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
            <CardTitle className="text-card-foreground">Air Quality Index (AQI) Trends</CardTitle>
            <CardDescription>Error loading air quality data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full flex flex-col items-center justify-center space-y-4">
              <div className="text-red-500 text-center">
                {error?.response?.data?.message || error?.message || 'Failed to fetch gas sensor data'}
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

  if (!airQualityData || airQualityData.length === 0) {
    return (
      <div className="space-y-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-card-foreground">Air Quality Index (AQI) Trends</CardTitle>
            <CardDescription>No air quality data available</CardDescription>
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
              <CardTitle className="text-card-foreground">Air Quality Index (AQI) Trends</CardTitle>
              <CardDescription>
                Real-time air quality monitoring data ({airQualityData.length} data points)
              </CardDescription>
            </div>
            <button 
              onClick={() => void refetch()}
              className="px-3 py-1.5 text-sm bg-green-600/10 hover:bg-green-600/20 text-green-600 border border-green-600/20 rounded-md transition-colors"
            >
              Refresh
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={airQualityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 197, 94, 0.1)" />
                <XAxis dataKey="time" stroke="rgba(156, 163, 175, 0.8)" fontSize={12} />
                <YAxis stroke="rgba(156, 163, 175, 0.8)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    borderRadius: "8px",
                    color: "white",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="gas_value"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#22c55e", strokeWidth: 2 }}
                  name="Gas Value (ppm)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-card-foreground">Air Quality Status</CardTitle>
            <CardDescription>Air quality classification over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={airQualityData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 197, 94, 0.1)" />
                  <XAxis dataKey="time" stroke="rgba(156, 163, 175, 0.8)" fontSize={10} />
                  <YAxis 
                    stroke="rgba(156, 163, 175, 0.8)" 
                    fontSize={10}
                    domain={[0, 2]}
                    tickFormatter={(value) => value === 2 ? 'Poor' : value === 1 ? 'Normal' : 'Unknown'}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      borderRadius: "8px",
                      color: "white",
                    }}
                    formatter={(value) => [value === 2 ? 'Poor' : value === 1 ? 'Normal' : 'Unknown', "Air Quality"]}
                  />
                  <Line
                    type="stepAfter"
                    dataKey="air_quality_numeric"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: "#10b981", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-card-foreground">Latest Readings</CardTitle>
            <CardDescription>Current air quality metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {airQualityData.slice(-3).reverse().map((reading, index) => (
                <div key={reading.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm font-medium">{reading.time}</p>
                    <p className="text-xs text-muted-foreground">
                      Gas Value: {reading.gas_value}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    reading.air_quality === 'Poor' 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : reading.air_quality === 'Normal'
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {reading.air_quality}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}