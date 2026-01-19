# AI髮型模擬器

使用 Nano Banana Pro (Gemini 3 Pro Image Preview) API 生成髮型模擬圖的手機版網頁應用。

## 功能特點

- 上傳個人正面及側面大頭照
- 上傳喜歡的髮型參考照片
- AI生成髮型轉換效果圖
- 手機優化的響應式設計
- 本地存儲，保護隱私

## 技術棧

- Vue.js 3 (Composition API)
- Vite
- Tailwind CSS
- IndexedDB (via localForage)
- Axios
- Google Gemini API

## 開始使用

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

複製 `.env.example` 到 `.env.local` 並填入你的 API 金鑰：

```bash
cp .env.example .env.local
```

編輯 `.env.local`：
```
VITE_GEMINI_API_KEY=你的API金鑰
```

獲取API金鑰: https://aistudio.google.com/

### 3. 啟動開發伺服器

```bash
npm run dev
```

應用將在 http://localhost:3000 啟動

### 4. 建置生產版本

```bash
npm run build
```

## 使用說明

1. **設定個人照片**: 進入「設定」頁面上傳你的正面及側面大頭照
2. **選擇髮型**: 在首頁上傳你想嘗試的髮型參考照片
3. **生成結果**: 點擊「生成髮型」按鈕，等待AI處理
4. **查看結果**: 系統會顯示生成的髮型模擬圖，可下載保存

## API 使用說明

- **費用**: 約 $0.134 per 2K 圖片
- **免費額度**: 每日 50-100 次請求
- **處理時間**: 10-30 秒

## 注意事項

- 建議上傳清晰的正面照片以獲得最佳效果
- 照片會儲存在瀏覽器本地，不會上傳到伺服器
- API 金鑰請妥善保管，不要公開分享

## License

MIT
