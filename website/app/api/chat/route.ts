export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const message = formData.get("message") as string
    const files = formData.getAll("files") as File[]

    if (!message && files.length === 0) {
      return Response.json({ error: "Message or files required" }, { status: 400 })
    }

    // Simulate AI processing with file awareness
    let responseContent = `I've received your message${files.length > 0 ? ` with ${files.length} file(s)` : ""}.`

    if (files.length > 0) {
      const fileNames = files.map((f) => f.name).join(", ")
      responseContent += ` Files analyzed: ${fileNames}.`
    }

    if (message) {
      responseContent += ` You said: "${message}". How can I help you further?`
    }

    return Response.json({
      success: true,
      response: responseContent,
      filesProcessed: files.length,
    })
  } catch (error) {
    console.error("Error processing chat:", error)
    return Response.json({ error: "Failed to process message" }, { status: 500 })
  }
}
