import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // Validate files
    const validatedFiles = files.filter((file) => {
      const validTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "text/plain",
      ]
      return validTypes.includes(file.type) && file.size > 0
    })

    if (validatedFiles.length === 0) {
      return NextResponse.json({ error: "No valid files provided" }, { status: 400 })
    }

    // Forward to FastAPI backend
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000"
    const backendFormData = new FormData()
    validatedFiles.forEach((file) => {
      backendFormData.append("files", file)
    })

    const response = await fetch(`${backendUrl}/api/analyze`, {
      method: "POST",
      body: backendFormData,
    })

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[API Error] /api/analyze:", error)
    return NextResponse.json({ error: "Failed to analyze files" }, { status: 500 })
  }
}
