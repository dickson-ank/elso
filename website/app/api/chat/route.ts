import client from "@/lib/client";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const message = formData.get("message") as string;
    const files = formData.getAll("files") as File[];
    // const filesMessages: ChatCompletionMessage[] = files.map((file) => ({
    //   role: "user",
    //   content: `Attached file: ${file}`,
    // }));
    const images_Base64 = await Promise.all(
      files.map(async (file) => {
        const buffer = await file.arrayBuffer();
        const image_b64 = Buffer.from(buffer).toString("base64");
        return image_b64;
      })
    );
    console.log(images_Base64.join("*************************"));

    if (!message && files.length === 0) {
      return Response.json(
        { error: "Message or files required" },
        { status: 400 }
      );
    }
    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content:
            "You are a seasoned dentist, analyse the images transformed to base64 encoding and provide in bullet-formatted brief descriptions, a first-hand diagnosis, if you see anything unrelated to your job, report what they are and ask your client to upload the right images",
        },
        { role: "user", content: `${message} ${images_Base64.join(",")}` },
      ],
      temperature: 0.2,
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

    return new Response(stream);
  } catch (error) {
    console.error("Error processing chat:", error);
    return Response.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
