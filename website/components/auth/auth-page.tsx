"use client"

import { useState } from "react"
import SignInForm from "./sign-in-form"
import SignUpForm from "./sign-up-form"


export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">AI Chat</h1>
          <p className="text-muted-foreground text-sm">Intelligent conversation at your fingertips</p>
        </div>

        {isSignUp ? (
          <SignUpForm onSuccess={onAuthSuccess} onToggle={() => setIsSignUp(false)} />
        ) : (
          <SignInForm onSuccess={onAuthSuccess} onToggle={() => setIsSignUp(true)} />
        )}
      </div>
    </div>
  )
}
