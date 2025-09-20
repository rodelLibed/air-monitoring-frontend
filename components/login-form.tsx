"use client"

import type React from "react"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

import axios, { AxiosError } from "axios"

import { useRouter } from "next/navigation"

// Define types for the API
interface LoginCredentials {
  username: string
  password: string
}

interface LoginResponse {
  success: boolean
  message: string
  user?: string
}

interface LoginError {
  message: string
  status?: number
}

import { apiClient } from "@/helpers/axiosInstance"

// API function for login using Axios
const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/login', credentials)
    return response.data
  } catch (error) {
    // Handle Axios errors
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      const errorStatus = error.response?.status
      
      throw {
        message: errorMessage,
        status: errorStatus
      } as LoginError
    }
    
    // Handle non-Axios errors
    throw {
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    } as LoginError
  }
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const router = useRouter()

  // TanStack Query mutation for login
  const loginMutation = useMutation<LoginResponse, LoginError, LoginCredentials>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      console.log('Login successful:', data)
      // Handle successful login
      if (data.success && data.user) {
        // Store user data
        localStorage.setItem('username', data.user)
        // Redirect user or update app state
        router.push('/dashboard') // if using Next.js router
      }
    },
    onError: (error) => {
      console.error('Login failed:', error)
      // Error handling is managed by the mutation state
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username || !password) {
      return
    }

    loginMutation.mutate({
      username,
      password
    })
  }

  const { isPending, error, isSuccess } = loginMutation

  return (
    <Card className="w-full max-w-md mx-auto backdrop-blur-sm bg-card/80 border-border/50 shadow-2xl animate-float">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-muted-foreground">Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Success Message */}
          {isSuccess && (
            <Alert className="border-green-200 bg-green-50 text-green-800">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Login successful! Redirecting...
              </AlertDescription>
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert className="border-red-200 bg-red-50 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error.message || 'Login failed. Please try again.'}
                {error.status && ` (Status: ${error.status})`}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium text-card-foreground">
              Username
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-input border-border focus:ring-2 focus:ring-ring transition-all duration-200"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-card-foreground">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-input border-border focus:ring-2 focus:ring-ring transition-all duration-200"
                required
                disabled={isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isPending}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={isPending || !username || !password}
          >
            {isPending ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}