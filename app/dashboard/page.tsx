"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { AirQualityCard } from "@/components/air-quality-card"
import { TemperatureCard } from "@/components/temperature-card"
import { AirQualityChart } from "@/components/air-quality-chart"
import { TemperatureChart } from "@/components/temperature-chart"
import { AnimatedBackground } from "@/components/animated-background"

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<"dashboard" | "air-quality" | "temperature">("air-quality")

  const renderContent = () => {
    switch (activeView) {
      case "air-quality":
        return (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Air Quality Monitoring</h1>
              <p className="text-muted-foreground">Air quality trends and analysis</p>
            </div>
            <AirQualityChart />
          </div>
        )
      case "temperature":
        return (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Temperature Monitoring</h1>
              <p className="text-muted-foreground">Temperature trends and historical data</p>
            </div>
            <TemperatureChart />
          </div>
        )
      default:
        return (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Environmental Dashboard</h1>
              <p className="text-muted-foreground">Monitor air quality and temperature</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AirQualityCard />
              <TemperatureCard />
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex bg-background dark">
      <AnimatedBackground />
      <DashboardSidebar activeView={activeView} onViewChange={setActiveView} />
      <main className="flex-1 p-6 relative z-10">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </main>
    </div>
  )
}
