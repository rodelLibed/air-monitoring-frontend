import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wind, CheckCircle } from "lucide-react"

export function AirQualityCard() {
  const airQualityData = {
    aqi: 42,
    status: "Good",
    pm25: 12,
    pm10: 18,
    co: 0.3,
    no2: 15,
    o3: 45,
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "good":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "moderate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "unhealthy":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Wind className="h-5 w-5 text-primary" />
          Air Quality Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary mb-2">{airQualityData.aqi}</div>
          <Badge className={getStatusColor(airQualityData.status)}>
            <CheckCircle className="h-3 w-3 mr-1" />
            {airQualityData.status}
          </Badge>
        </div>

        {/* <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-sm text-muted-foreground">PM2.5</div>
            <div className="text-lg font-semibold text-foreground">{airQualityData.pm25} μg/m³</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-sm text-muted-foreground">PM10</div>
            <div className="text-lg font-semibold text-foreground">{airQualityData.pm10} μg/m³</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-sm text-muted-foreground">CO</div>
            <div className="text-lg font-semibold text-foreground">{airQualityData.co} mg/m³</div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="text-sm text-muted-foreground">NO₂</div>
            <div className="text-lg font-semibold text-foreground">{airQualityData.no2} μg/m³</div>
          </div>
        </div> */}

        <div className="bg-accent/20 rounded-lg p-4 border border-accent/30 mt-[160px]">
          <div className="flex items-center gap-2 text-accent-foreground">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Air quality is good today</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Perfect conditions for outdoor activities</p>
        </div>
      </CardContent>
    </Card>
  )
}
