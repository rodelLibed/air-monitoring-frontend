import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Thermometer, TrendingUp, TrendingDown, Droplets, Eye } from "lucide-react"

export function TemperatureCard() {
  const temperatureData = {
    current: 24,
    feelsLike: 26,
    humidity: 65,
    visibility: 10,
    trend: "up",
    high: 28,
    low: 18,
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Thermometer className="h-5 w-5 text-primary" />
          Temperature Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl font-bold text-primary">{temperatureData.current}°C</span>
            {temperatureData.trend === "up" ? (
              <TrendingUp className="h-6 w-6 text-green-400" />
            ) : (
              <TrendingDown className="h-6 w-6 text-red-400" />
            )}
          </div>
          <p className="text-muted-foreground">Feels like {temperatureData.feelsLike}°C</p>
        </div>

        {/* <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-sm text-muted-foreground">High</div>
            <div className="text-lg font-semibold text-foreground">{temperatureData.high}°C</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-sm text-muted-foreground">Low</div>
            <div className="text-lg font-semibold text-foreground">{temperatureData.low}°C</div>
          </div>
        </div> */}

        <div className="space-y-11 mt-20">
          <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-foreground">Humidity</span>
            </div>
            <span className="font-semibold text-foreground">{temperatureData.humidity}%</span>
          </div>

          
        </div>

        <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
          <div className="flex items-center gap-2 text-primary">
            <Thermometer className="h-4 w-4" />
            <span className="text-sm font-medium">Comfortable temperature range</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Perfect weather conditions today</p>
        </div>
      </CardContent>
    </Card>
  )
}
