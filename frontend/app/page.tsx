"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AuthContainer from "@/components/auth/auth-container"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem("user")
    if (user) {
      router.push("/chat")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-primary rounded-full"></div>
        </div>
      </div>
    )
  }

  return <AuthContainer />
}
