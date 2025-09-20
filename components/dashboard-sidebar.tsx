"use client"

import { Home, Wind, Thermometer, Settings, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DashboardSidebarProps {
  activeView: "dashboard" | "air-quality" | "temperature"
  onViewChange: (view: "dashboard" | "air-quality" | "temperature") => void
}

export function DashboardSidebar({ activeView, onViewChange }: DashboardSidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border p-4 relative z-20">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-sidebar-foreground">Monitoring</h2>
        <p className="text-sm text-muted-foreground">Environmental Dashboard</p>
      </div>

      <nav className="space-y-2">
        <Button
          variant="ghost"
          onClick={() => onViewChange("dashboard")}
          className={`w-full justify-start ${
            activeView === "dashboard"
              ? "text-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          }`}
        >
          <Home className="mr-3 h-4 w-4" />
          Dashboard
        </Button>

        <Button
          variant="ghost"
          onClick={() => onViewChange("air-quality")}
          className={`w-full justify-start ${
            activeView === "air-quality"
              ? "text-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          }`}
        >
          <Wind className="mr-3 h-4 w-4" />
          Air Quality Monitoring
        </Button>

        <Button
          variant="ghost"
          onClick={() => onViewChange("temperature")}
          className={`w-full justify-start ${
            activeView === "temperature"
              ? "text-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          }`}
        >
          <Thermometer className="mr-3 h-4 w-4" />
          Temperature
        </Button>


        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <Settings className="mr-3 h-4 w-4" />
          Settings
        </Button>
      </nav>
    </aside>
  )
}
