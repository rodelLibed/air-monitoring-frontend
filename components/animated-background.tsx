"use client"

import { useEffect, useState } from "react"

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const gridPattern =
    "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23166534' fillOpacity='0.08'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 animate-gradient" />

      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl animate-float"
        style={{
          background: "rgba(34, 197, 94, 0.1)",
        }}
      />
      <div
        className="absolute top-3/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float"
        style={{
          animationDelay: "2s",
          background: "rgba(22, 163, 74, 0.08)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full blur-2xl animate-pulse-glow"
        style={{
          animationDelay: "1s",
          background: "rgba(74, 222, 128, 0.12)",
        }}
      />

      <div
        className="absolute top-1/6 right-1/3 w-32 h-32 rounded-full blur-2xl animate-float"
        style={{
          animationDelay: "3s",
          background: "rgba(16, 185, 129, 0.06)",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("${gridPattern}")`,
        }}
      />
    </div>
  )
}
