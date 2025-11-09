"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import FormField from "@/components/common/form-field"


export default function SignUpForm({ onSuccess, onToggle }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    companyId: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const { fullName, companyName, companyId, email, password, confirmPassword } = formData

      if (!fullName || !companyName || !companyId || !email || !password) {
        setError("Please fill in all fields")
        return
      }

      if (!email.includes("@")) {
        setError("Invalid email address")
        return
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      localStorage.setItem("authToken", `token_${Date.now()}`)
      localStorage.setItem("userName", fullName)
      localStorage.setItem("userEmail", email)
      onSuccess()
    } catch (err) {
      setError("Sign up failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <FormField
        label="Full Name"
        name="fullName"
        placeholder="John Doe"
        value={formData.fullName}
        onChange={handleChange}
      />
      <FormField
        label="Company Name"
        name="companyName"
        placeholder="Acme Corp"
        value={formData.companyName}
        onChange={handleChange}
      />
      <FormField
        label="Company ID"
        name="companyId"
        placeholder="AC123"
        value={formData.companyId}
        onChange={handleChange}
      />
      <FormField
        label="Email"
        name="email"
        type="email"
        placeholder="john@company.com"
        value={formData.email}
        onChange={handleChange}
      />
      <FormField
        label="Password"
        name="password"
        type="password"
        placeholder="Min 6 characters"
        value={formData.password}
        onChange={handleChange}
      />
      <FormField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Confirm password"
        value={formData.confirmPassword}
        onChange={handleChange}
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Sign Up"}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <button type="button" onClick={onToggle} className="text-primary hover:underline font-medium">
          Sign in
        </button>
      </p>
    </form>
  )
}
