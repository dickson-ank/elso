import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, fileIds, conversationId } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Forward to FastAPI backend
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000"
    const response = await fetch(`${backendUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        fileIds: fileIds || [],
        conversationId,
      }),
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[API Error] /api/chat:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}
