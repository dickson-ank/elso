import { NextResponse } from "next/server"

export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000"
    const response = await fetch(`${backendUrl}/health`, {
      method: "GET",
    })

    if (!response.ok) {
      return NextResponse.json({ status: "backend_unavailable" }, { status: 503 })
    }

    return NextResponse.json({ status: "healthy" })
  } catch (error) {
    console.error("[API Error] /api/health:", error)
    return NextResponse.json({ status: "unhealthy", error: "Backend connection failed" }, { status: 503 })
  }
}
