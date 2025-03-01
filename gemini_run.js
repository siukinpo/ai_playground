// try the gemini api
// https://aistudio.google.com/u/2/apikey
// 注意：Gemini API 存取有地區限制
// 1. Google AI Studio 網頁版可以在香港地區正常使用
// 2. 但透過 API 從香港發出的請求會被阻擋
// 3. API 錯誤訊息：User location is not supported for the API use
// 4. 解決方案：
//    - 使用 VPN 連接到支援的地區來呼叫 API
//    - 或等待 Google 開放香港地區的 API 存取權限
//    - 或改用網頁版進行測試

import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.gemini_api_key);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function runGemini() {
  try {
    console.log("開始執行 Gemini AI...");
    const prompt = "3.11 和 3.9 哪一個比較大？";
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
  } catch (error) {
    console.error("執行 Gemini AI 時發生錯誤:", error);
  }
}

runGemini();
