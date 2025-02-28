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

async function grok_run_text() {
  const completion = await client.chat.completions.create({
    model: "grok-2-latest",
    messages: [
      {
        role: "system",
        content: "你是一位出色且富有創造力的數學家，擅長解決各種數學問題。",
      },
      {
        role: "user",
        content: "3.11和3.9哪一個比較大? 以及提供詳盡解釋",
      },
    ],
    model: "grok-2-latest",
    stream: false,
    temperature: 0,
  });

  console.log(completion.choices[0].message.content);
}

async function grok_run_image(image_url) {
  const completion = await client.chat.completions.create({
    model: "grok-2-vision-latest",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: {
              url: image_url,
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
  });

  console.log(completion.choices[0].message.content);
}

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

    const completion = await client.chat.completions.create({
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
    });

    console.log(completion.choices[0].message.content);
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
];

// grok_run_text();

// 測試示例
// 1. 使用網絡圖片
grok_run_any_image(image_list[1]);

// 2. 使用本地圖片
// grok_run_any_image("./strawberry_souffle.jpeg");

// 3. 你可以根據需要切換不同的圖片
// grok_run_any_image(image_list[1]);
