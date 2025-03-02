// try the grok 2 api
// https://docs.x.ai/docs/tutorial#step-1-create-an-xai-account
import OpenAI from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.grok_api_key,
  baseURL: "https://api.x.ai/v1",
});

// 1. Normal , without stream
// https://docs.x.ai/docs/guides/chat
async function grok_run_text() {
  const completion = await client.chat.completions.create({
    model: "grok-2-latest",
    messages: [
      {
        role: "system",
        content: "You are a PhD-level mathematician.",
      },
      {
        role: "user",
        content: "What is 2 + 2? 請用繁體中文回答 並提供詳細解釋",
      },
    ],
    model: "grok-2-latest",
    stream: false,
    temperature: 0,
  });

  console.log(completion.choices[0].message.content);
}

// 2. Streaming , with stream
// https://docs.x.ai/docs/guides/streaming-response
async function grok_run_text_stream() {
  const result = await client.chat.completions.create({
    model: "grok-2-latest",
    messages: [
      {
        role: "system",
        content: "You are a PhD-level mathematician.",
      },
      {
        role: "user",
        content: "What is 2 + 2? 請用繁體中文回答 並提供詳細解釋",
      },
    ],
    stream: true,
  });

  for await (const chunk of result) {
    process.stdout.write(chunk.choices[0].delta.content || "");
  }
}

// 3. 使用圖片 , with stream
// https://docs.x.ai/docs/guides/image-understanding#base64-string-input
async function grok_run_any_image(imagePath) {
  try {
    let imageUrl;

    // 檢查是否為網絡 URL
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      // 如果是網絡 URL，直接使用
      imageUrl = imagePath;
    } else {
      // 如果是本地文件，轉換為 Base64
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString("base64");
      const mimeType = getMimeType(imagePath);
      imageUrl = `data:${mimeType};base64,${base64Image}`;
    }

    const result = await client.chat.completions.create({
      model: "grok-2-vision-latest",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
                detail: "high",
              },
            },
            {
              type: "text",
              text: "這圖片中有什麼？",
            },
          ],
        },
      ],
      stream: true,
    });

    // console.log(completion.choices[0].message.content);
    for await (const chunk of result) {
      process.stdout.write(chunk.choices[0].delta.content || "");
    }
  } catch (error) {
    console.error("處理圖片時出錯:", error);
  }
}

// 根據檔案副檔名獲取 MIME 類型
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".bmp": "image/bmp",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

const image_list = [
  "https://science.nasa.gov/wp-content/uploads/2023/09/web-first-images-release.png",
  "./strawberry_souffle.jpeg",
  "https://i.ytimg.com/vi/oJAPUFXIaqo/maxresdefault.jpg",
  "https://hkppltravel.com/wp-content/uploads/2020/01/%E8%B6%85%E5%8E%9A%E5%BF%8C%E5%BB%89%E5%A3%AB%E5%A4%9A%E5%95%A4%E6%A2%A8%E6%A2%B3%E4%B9%8E%E5%8E%98%E7%8F%AD%E6%88%9F.jpg",
];

// 測試示例
// grok_run_text();
// grok_run_text_stream();
grok_run_any_image(image_list[2]);
