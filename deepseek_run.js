// try the deepseek api
// https://platform.deepseek.com/api_keys
// deepseek-reasoner streaming => https://api-docs.deepseek.com/guides/reasoning_model
// multiround conversation => https://api-docs.deepseek.com/guides/multi_round_chat

// Please install OpenAI SDK first: `npm install openai`

import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

// 檢查 API 金鑰是否存在
if (!process.env.deepseek_api_key) {
  console.error("錯誤：請在 .env 檔案中設置 deepseek_api_key");
  process.exit(1);
}

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com", // 修正 API 端點
  apiKey: process.env.deepseek_api_key,
});

async function list_models() {
  const models = await openai.models.list();
  for await (const model of models) {
    console.log(model);
  }
}

// No streaming , deepseek-chat
async function deepseek_run_text() {
  try {
    console.log("開始執行 DeepSeek AI...");
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "你是一個有用的助手。" },
        // { role: "user", content: "3.11和3.9哪一個比較大？請提供詳盡解釋" },
      ],
      model: "deepseek-chat",
    });

    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error("執行 DeepSeek AI 時發生錯誤:", error);
  }
}

// Streaming, deepseek-chat
async function deepseek_run_text_stream() {
  const result = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "你是一位出色且富有創造力的數學家，擅長解決各種數學問題。",
      },
      {
        role: "user",
        content: "9.11 and 9.8, which is greater? 請用繁體中文回覆",
      },
    ],
    model: "deepseek-chat",
    stream: true,
  });

  for await (const chunk of result) {
    process.stdout.write(chunk.choices[0]?.delta?.content || "");
  }
}

// Streaming , deepseek-reasoner
async function deepseek_run_reasoner_stream() {
  const result = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "你是一位出色且富有創造力的數學家，擅長解決各種數學問題。",
      },
      {
        role: "user",
        // content: "Which number is larger, 9.11 or 9.8? 請用繁體中文回覆",
        content: "我和你誰比較厲害？",
      },
    ],
    model: "deepseek-reasoner",
    stream: true,
  });

  console.log(result);

  // 使用單一迭代處理所有內容
  process.stdout.write("以下是推理過程：\n");
  let hasShownResponseHeader = false; // 用於追蹤是否已顯示回應標題

  for await (const chunk of result) {
    // 如果有推理內容，則輸出
    if (chunk.choices[0]?.delta?.reasoning_content) {
      process.stdout.write(chunk.choices[0].delta.reasoning_content);
    }
    // 如果有一般內容，且還沒顯示過回應標題，則先顯示標題
    if (chunk.choices[0]?.delta?.content && !hasShownResponseHeader) {
      process.stdout.write("\n以下是回應：\n");
      hasShownResponseHeader = true;
      process.stdout.write(chunk.choices[0].delta.content);
    } else if (chunk.choices[0]?.delta?.content) {
      process.stdout.write(chunk.choices[0].delta.content);
    }
  }

  // 最後輸出換行
  process.stdout.write("\n");
}

// list_models
// deepseek_run_text();
// deepseek_run_text_stream();
deepseek_run_reasoner_stream();
