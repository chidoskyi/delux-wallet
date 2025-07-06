"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"


export default function LoginPage() {
  const { login, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const loading = isLoading || authLoading

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const response = await login(formData.email, formData.password)
      if (response) {
        // Store next_steps for walletSetup
        // if (response.next_steps) {
        //   localStorage.setItem('next_steps', JSON.stringify(response.next_steps));
        // } else {
        //   localStorage.removeItem('next_steps');
        // }
        console.log("Login successful")
        navigate('/setup')
      } else {
        setErrors({
          email: "Invalid email or password",
          password: "Invalid email or password"
        })
      }
    } catch (error: any) {
      console.error("Login error:", error)
      setErrors({
        email: "An error occurred. Please try again.",
        password: ""
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center mb-8">
          <a href="/" className="mr-4">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="h-6 w-6" />
            </Button>
          </a>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#FFB800] rounded-full flex items-center justify-center mr-3">
              <div className="w-4 h-4 bg-black rounded-full"></div>
            </div>
            <span className="text-2xl font-bold">Hitrex</span>
          </div>
        </div>

        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
            <p className="text-gray-400 mt-2">Sign in to your Hitrex account</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                  placeholder="Enter your email"
                  disabled={loading}
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white pr-10"
                    placeholder="Enter your password"
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#FFB800] focus:ring-[#FFB800] border-gray-600 rounded bg-gray-800"
                    disabled={loading}
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="text-[#FFB800] hover:underline">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#FFB800] hover:bg-[#FFB800]/90 text-black font-bold py-3 text-lg"
                                    disabled={loading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <a href="/signup" className="text-[#FFB800] hover:underline font-semibold">
                  Sign up
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}