"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

// Sample temperature data
const temperatureData = [
  { time: "00:00", temperature: 18.5, humidity: 65 },
  { time: "02:00", temperature: 17.8, humidity: 68 },
  { time: "04:00", temperature: 16.9, humidity: 72 },
  { time: "06:00", temperature: 16.2, humidity: 75 },
  { time: "08:00", temperature: 18.7, humidity: 70 },
  { time: "10:00", temperature: 22.3, humidity: 62 },
  { time: "12:00", temperature: 26.8, humidity: 55 },
  { time: "14:00", temperature: 29.4, humidity: 48 },
  { time: "16:00", temperature: 31.2, humidity: 45 },
  { time: "18:00", temperature: 28.9, humidity: 52 },
  { time: "20:00", temperature: 25.6, humidity: 58 },
  { time: "22:00", temperature: 22.1, humidity: 63 },
]

const weeklyData = [
  { day: "Mon", high: 28, low: 16 },
  { day: "Tue", high: 31, low: 18 },
  { day: "Wed", high: 29, low: 17 },
  { day: "Thu", high: 26, low: 15 },
  { day: "Fri", high: 24, low: 14 },
  { day: "Sat", high: 27, low: 16 },
  { day: "Sun", high: 30, low: 19 },
]

export function TemperatureChart() {
  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-card-foreground">24-Hour Temperature Monitoring</CardTitle>
          <CardDescription>Temperature and humidity monitoring</CardDescription>
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
                  formatter={(value, name) => [
                    name === "temperature" ? `${value}°C` : `${value}%`,
                    name === "temperature" ? "Temperature" : "Humidity",
                  ]}
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
                  {temperatureData[temperatureData.length - 1].temperature}°C
                </div>
                <div className="text-sm text-muted-foreground">Current Temperature</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Humidity</span>
                  <span className="text-sm text-green-400">
                    {temperatureData[temperatureData.length - 1].humidity}%
                  </span>
                </div>
                <div className="w-full bg-green-900/20 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-600 to-green-400 h-2 rounded-full"
                    style={{ width: `${temperatureData[temperatureData.length - 1].humidity}%` }}
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
