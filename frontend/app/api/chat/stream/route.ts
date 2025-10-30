import { streamText } from "ai";

export async function POST(request: Request) {
  try {
    const { messages, fileContext } = await request.json();

    if (!messages || messages.length === 0) {
      return new Response("No messages provided", { status: 400 });
    }

    // Use the Vercel AI Gateway with OpenAI by default
    const result = streamText({
      model: "openai/gpt-4-turbo",
      system: `You are DentalAI, an expert AI assistant specialized in dental analysis and consultation. 
You help dental professionals analyze documents, images, and reports with precision and professionalism.
${fileContext ? `\n\nContext from uploaded files:\n${fileContext}` : ""}
Provide clear, actionable insights and recommendations based on the information provided.`,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature: 0.7,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[AI Stream Error]:", error);
    return new Response("Failed to stream response", { status: 500 });
  }
}
