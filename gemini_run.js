// try the gemini api
// https://aistudio.google.com/u/2/apikey
// https://ai.google.dev/gemini-api/docs?hl=zh-tw
// https://ai.google.dev/gemini-api/docs/vision?hl=zh-tw&lang=node

// 文字生成：https://ai.google.dev/gemini-api/docs/text-generation?hl=zh-tw&lang=node
// 處理圖片和影片：https://ai.google.dev/gemini-api/docs/vision?hl=zh-tw&lang=node
// 注意：Gemini API 存取有地區限制
// 1. Google AI Studio 網頁版可以在香港地區正常使用
// 2. 但透過 API 從香港發出的請求會被阻擋
// 3. API 錯誤訊息：User location is not supported for the API use
// 4. 解決方案：
//    - 使用 VPN 連接到支援的地區來呼叫 API
//    - 或等待 Google 開放香港地區的 API 存取權限
//    - 或改用網頁版進行測試

import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.gemini_api_key);
// const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

// 1. 使用純文字輸入內容產生文字
async function runGemini_no_stream() {
  try {
    console.log("開始執行 Gemini AI...");
    const prompt = "3.11 和 3.9 哪一個比較大？";
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (error) {
    console.error("執行 Gemini AI 時發生錯誤:", error);
  }
}

// 2. 產生文字串流
async function runGemini_stream() {
  const prompt = "3.11 和 3.9 哪一個比較大？ 請提供詳盡解釋";

  const result = await model.generateContentStream(prompt);

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
  }
}

// 3. 使用文字和圖片輸入內容來生成文字
async function runGemini_text_and_image() {
  function fileToGenerativePart(path, mimeType) {
    return {
      inlineData: {
        data: Buffer.from(fs.readFileSync(path)).toString("base64"),
        mimeType,
      },
    };
  }

  const prompt = "請描述這張圖片的內容";
  const imagePart = fileToGenerativePart(
    "./strawberry_souffle.jpeg",
    "image/jpeg"
  );

  //   const result = await model.generateContent([prompt, imagePart]);
  const result = await model.generateContentStream([prompt, imagePart]);
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
  }
}

// 4. 建立即時通訊對話
async function runGemini_chat() {
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });

  let result = await chat.sendMessage("I have 2 dogs in my house.");
  console.log(result.response.text());
  let result2 = await chat.sendMessage("How many paws are in my house?");
  console.log(result2.response.text());
}

// 5. 使用串流直播搭配即時通訊
async function runGemini_stream_and_chat() {
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });

  let result = await chat.sendMessageStream("I have 2 dogs in my house.");
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
  }
  let result2 = await chat.sendMessageStream("How many paws are in my house?");
  for await (const chunk of result2.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
  }
}

// 6. 上載 Base64 編碼圖片
async function runGemini_upload_image() {
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });

  const imageResp = await fetch(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg/2560px-Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg"
  ).then((response) => response.arrayBuffer());

  const result = await model.generateContentStream([
    {
      inlineData: {
        data: Buffer.from(imageResp).toString("base64"),
        mimeType: "image/jpeg",
      },
    },
    "Caption this image. 請用繁體中文回答",
  ]);
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
  }
}

// 7. 如要以 Base64 編碼格式提示多張圖片，請執行下列操作：
async function runGemini_upload_multiple_images() {
  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });

  const imageResp1 = await fetch(
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg/2560px-Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg"
  ).then((response) => response.arrayBuffer());

  const imageResp2 = await fetch(
    "https://www.hanchao.com/varimg/photogallery/Article_Photo/5768/big_313538.jpg"
  ).then((response) => response.arrayBuffer());

  const result = await model.generateContentStream([
    {
      inlineData: {
        data: Buffer.from(imageResp1).toString("base64"),
        mimeType: "image/jpeg",
      },
    },
    {
      inlineData: {
        data: Buffer.from(imageResp2).toString("base64"),
        mimeType: "image/jpeg",
      },
    },
    "Generate a list of all the objects contained in both images. 請用繁體中文回答",
  ]);
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
  }
}

// runGemini_no_stream();
// runGemini_stream();
// runGemini_text_and_image();
// runGemini_chat();
// runGemini_stream_and_chat();
// runGemini_upload_image();
runGemini_upload_multiple_images();
