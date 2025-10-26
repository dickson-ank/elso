"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PasswordInput } from "./password-input"

export default function LoginForm({
  onSignUp,
  onForgotPassword,
}: {
  onSignUp: () => void
  onForgotPassword: () => void
}) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Simulate authentication - in production, call your backend
      if (email && password.length >= 6) {
        const userData = {
          email,
          name: email.split("@")[0],
          id: Math.random().toString(36).substr(2, 9),
        }
        localStorage.setItem("user", JSON.stringify(userData))
        router.push("/chat")
      } else {
        setError("Please enter valid credentials")
      }
    } catch (err) {
      setError("Authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary mb-4">
            <span className="text-primary-foreground font-bold text-lg">D</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">DentalAI</h1>
          <p className="text-sm text-muted-foreground mt-1">AI-Powered Dental Analysis</p>
        </div>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-9 text-sm"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-xs text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button
                type="submit"
                className="w-full h-9 text-sm font-medium bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button onClick={onSignUp} className="text-sm text-primary hover:text-primary/80 transition-colors">
                Don't have an account? Sign up
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Demo credentials: any email + password (min 6 chars)
        </p>
      </div>
    </div>
  )
}
