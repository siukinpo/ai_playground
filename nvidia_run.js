import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.nvidia_deepseek_api_key,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

async function nvidia_run() {
  const completion = await openai.chat.completions.create({
    model: "deepseek-ai/deepseek-r1",
    messages: [
      { role: "user", content: "Which number is larger, 9.11 or 9.8?" },
    ],
    temperature: 0.6,
    top_p: 0.7,
    max_tokens: 4096,
    stream: true,
  });

  for await (const chunk of completion) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}

nvidia_run();
