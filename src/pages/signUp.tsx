"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import authService from "../services/auth" // Import the auth service
import { showToast, toastMessages } from "../utils/toast"

export default function SignUpPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    phone: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.password_confirm) {
      newErrors.password_confirm = "Please confirm your password"
    } else if (formData.password !== formData.password_confirm) {
      newErrors.confirmPassword = "Passwords don't match"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
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
      const response = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirm: formData.password_confirm, // API expects password_confirm
        phone_number: formData.phone, // API expects phone_number
      })

      console.log("Registration successful:", response.message)
      console.log("User:", response.user)
      
      // Show success message using toast
      showToast.success(toastMessages.register.success)
      
      // Navigate to login page
      navigate('/login')
    } catch (error: any) {
      console.error("Registration error:", error)
      
      // Handle different types of errors
      if (error.response?.data) {
        const errorData = error.response.data
        const newErrors: Record<string, string> = {}

        // Handle field-specific errors from the API
        if (errorData.username) {
          newErrors.username = Array.isArray(errorData.username) 
            ? errorData.username[0] 
            : errorData.username
        }
        if (errorData.email) {
          newErrors.email = Array.isArray(errorData.email) 
            ? errorData.email[0] 
            : errorData.email
        }
        if (errorData.password) {
          newErrors.password = Array.isArray(errorData.password) 
            ? errorData.password[0] 
            : errorData.password
        }
        if (errorData.password_confirm) {
          newErrors.password_confirm = Array.isArray(errorData.password_confirm) 
            ? errorData.password_confirm[0] 
            : errorData.password_confirm
        }
        if (errorData.phone_number) {
          newErrors.phone = Array.isArray(errorData.phone_number) 
            ? errorData.phone_number[0] 
            : errorData.phone_number
        }

        // If there's a general error message
        if (errorData.message && Object.keys(newErrors).length === 0) {
          newErrors.email = errorData.message
        }

        setErrors(newErrors)
        showToast.error(toastMessages.register.error)
      } else {
        setErrors({
          email: "An error occurred. Please try again.",
        })
        showToast.error(toastMessages.register.error)
      }
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
            <CardTitle className="text-3xl font-bold text-white">Create Account</CardTitle>
            <p className="text-gray-400 mt-2">Join millions of users on Hitrex</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username" className="text-gray-300">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
                {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username}</p>}
              </div>

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
                  disabled={isLoading}
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
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <Label htmlFor="password_confirm" className="text-gray-300">
                  Confirm Password
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password_confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.password_confirm}
                    onChange={(e) => handleChange("password_confirm", e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white pr-10"
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-300">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white mt-1"
                  placeholder="Enter your phone number"
                  disabled={isLoading}
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#FFB800] hover:bg-[#FFB800]/90 text-black font-bold py-3 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Already have an account?{" "}
                <a href="/login" className="text-[#FFB800] hover:underline font-semibold">
                  Log in
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}