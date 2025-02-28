# AI API 測試專案

這個專案提供了與多種大型語言模型 API 進行互動的簡單介面，包括 X.AI 的 Grok 和 NVIDIA 的 DeepSeek。這是一個實驗性質的專案，用於測試和比較不同 AI 模型的能力和特點。

## 支援的 AI 模型

- **X.AI Grok**：支援文字對話和圖像分析
- **NVIDIA DeepSeek**：支援文字對話

## 功能特點

- **文字對話**：向不同 AI 模型發送文字問題並獲取回應
- **圖像分析**：上傳圖像並讓 AI 描述圖像內容（目前僅 Grok 支援）
- **多種圖像來源支援**：
  - 網絡圖片 URL
  - 本地圖片檔案（自動轉換為 Base64 編碼）

## 安裝與設置

### 前提條件

- Node.js (建議 v14 或更高版本)
- 各 AI 平台的帳戶和 API 金鑰

### 安裝步驟

1. 克隆或下載此專案
2. 安裝依賴套件：

```bash
npm install
```

3. 創建 `.env` 檔案並添加你的 API 金鑰：

```
grok_api_key=你的_X.AI_API_金鑰
nvidia_deepseek_api_key=你的_NVIDIA_DEEPSEEK_API_金鑰
```

## 使用方法

### Grok AI

#### 文字對話

```javascript
// 在 grok_run.js 中
grok_run_text();
```

#### 圖像分析

```javascript
// 分析網絡圖片
grok_run_any_image("https://example.com/image.jpg");

// 分析本地圖片
grok_run_any_image("./local_image.jpg");
```

### NVIDIA DeepSeek

```javascript
// 在 nvidia_deepseek.js 中
// 運行文字對話
```

## 專案結構

- `grok_run.js` - X.AI Grok API 的測試代碼
- `nvidia_deepseek.js` - NVIDIA DeepSeek API 的測試代碼
- `.env` - 環境變數配置檔案

## 目的

這個專案的主要目的是提供一個簡單的方式來測試和比較不同 AI 模型的能力，幫助了解各個模型的優缺點和適用場景。這是一個實驗性質的工具，主要用於學習和研究。

## 注意事項

- 這是一個個人學習和測試用途的專案
- 確保你的 API 金鑰有效且有足夠的配額
- 不同 API 可能有不同的使用限制和計費方式

## 參考資料

- [X.AI API 文檔](https://docs.x.ai/docs/tutorial)
- [NVIDIA DeepSeek 文檔](https://www.nvidia.com/deepseek/)
- [OpenAI Node.js 客戶端](https://github.com/openai/openai-node)
