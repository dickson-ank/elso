import client from "@/lib/client" 

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const message = formData.get("message") as string
    const files = formData.getAll("files") as File[]

    if (!message && files.length === 0) {
      return Response.json({ error: "Message or files required" }, { status: 400 })
    }
  const completion = await client.chat.completions.create({
    model: "openai/gpt-oss-120b",
    messages: [{ role: "user", content: `${message}` }],
    temperature: 1,
    top_p: 1,
    max_tokens: 4096,
    stream: true,
  });
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of completion) {
        const text = chunk.choices[0]?.delta?.content || "";
        controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(stream)
  } catch (error) {
    console.error("Error processing chat:", error)
    return Response.json({ error: "Failed to process message" }, { status: 500 })
  }
}
  


  