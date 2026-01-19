# AI髮型模擬器 - 使用指南

## 🎉 項目已完成！

您的 AI 髮型模擬器已經成功建置完成。開發伺服器正在運行中。

**訪問地址:**
- 本地: http://localhost:3000/
- 網路: http://192.168.1.107:3000/

## 📱 功能概覽

### 核心功能
1. **個人照片管理** (設定頁面)
   - 上傳正面大頭照
   - 上傳側面大頭照
   - 照片儲存在瀏覽器本地 (IndexedDB)
   - 隨時刪除或更新照片

2. **髮型模擬** (首頁)
   - 上傳想要嘗試的髮型參考照片
   - 一鍵生成 AI 髮型效果圖
   - 即時顯示生成進度

3. **結果查看與分享**
   - 下載生成的髮型圖片
   - 分享到社交媒體 (支援行動裝置)
   - 前後對比效果

## 🚀 快速開始

### 第一步：設定 API 金鑰

編輯 `.env.local` 檔案，填入您的 Gemini API 金鑰：

```bash
VITE_GEMINI_API_KEY=你的API金鑰
```

**如何獲取 API 金鑰:**
1. 訪問 https://aistudio.google.com/
2. 登入您的 Google 帳號
3. 點擊 "Get API Key"
4. 創建新的 API 金鑰
5. 複製金鑰並貼到 `.env.local`

### 第二步：重啟開發伺服器

修改 `.env.local` 後，需要重啟伺服器：

```bash
# 按 Ctrl+C 停止當前伺服器
# 然後重新啟動
npm run dev
```

### 第三步：開始使用

1. 在瀏覽器中打開 http://localhost:3000/
2. 首次使用會看到提示，點擊「前往設定」
3. 上傳您的正面及側面照片
4. 點擊「完成設定」返回首頁
5. 上傳您想嘗試的髮型參考照片
6. 點擊「生成髮型效果」
7. 等待 10-30 秒，查看結果

## 📸 照片拍攝建議

### 個人照片 (正面)
- ✅ 光線充足，臉部清晰
- ✅ 直視鏡頭，表情自然
- ✅ 頭髮整理整齊
- ❌ 避免配戴帽子
- ❌ 避免濃妝或特效濾鏡

### 個人照片 (側面)
- ✅ 側臉 90 度角
- ✅ 展示完整頭部輪廓
- ✅ 與正面照光線一致
- ❌ 避免遮擋臉部

### 髮型參考照片
- ✅ 清晰的髮型照片
- ✅ 可以是雜誌、網路圖片
- ✅ 光線良好，髮型清楚可見
- ✅ 可嘗試不同風格

## 🛠 技術架構

### 技術棧
- **前端框架**: Vue.js 3 (Composition API)
- **建置工具**: Vite
- **樣式**: Tailwind CSS
- **儲存**: IndexedDB (via localForage)
- **HTTP 客戶端**: Axios
- **API**: Google Gemini 3 Pro Image Preview

### 項目結構
```
haircut/
├── src/
│   ├── components/          # Vue 元件
│   │   ├── ImageUploader.vue
│   │   ├── PhotoPreview.vue
│   │   ├── GenerationStatus.vue
│   │   └── ResultDisplay.vue
│   ├── views/              # 頁面視圖
│   │   ├── HomeView.vue
│   │   ├── SettingsView.vue
│   │   └── ResultView.vue
│   ├── composables/        # 組合式函數
│   │   ├── useImageStorage.js
│   │   ├── useImageCompression.js
│   │   └── useNanoBanana.js
│   ├── utils/              # 工具函數
│   │   ├── imageHelpers.js
│   │   └── apiClient.js
│   ├── router/             # 路由
│   │   └── index.js
│   └── assets/             # 靜態資源
│       └── styles/
│           └── main.css
├── public/                 # 公開資源
├── .env.local             # 環境變數 (不要提交到 Git)
├── .env.example           # 環境變數範例
├── package.json           # 專案配置
├── vite.config.js         # Vite 配置
└── tailwind.config.js     # Tailwind 配置
```

## 💰 API 成本與限制

### 定價
- **2K 解析度**: ~$0.134 / 每張圖片
- **免費額度**: 每日 50-100 次請求

### 使用建議
- 開發測試時謹慎使用，避免超出免費額度
- 生產環境建議設置用戶限制
- 監控 API 使用量

### 錯誤處理
應用已實作完整錯誤處理：
- ✅ API 金鑰無效
- ✅ 超出配額限制
- ✅ 請求頻率限制
- ✅ 網路連線錯誤
- ✅ 伺服器錯誤

## 🔧 開發命令

```bash
# 安裝依賴
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 📱 行動裝置測試

### 在手機上測試
1. 確保手機和電腦在同一網路
2. 在手機瀏覽器訪問: http://192.168.1.107:3000/
3. 可以直接使用手機相機拍照上傳

### PWA 支援 (未來增強)
目前版本是標準網頁應用，可以在未來添加：
- Service Worker
- 離線支援
- 安裝到主畫面

## 🔐 隱私與安全

### 資料儲存
- ✅ 所有照片儲存在瀏覽器本地 (IndexedDB)
- ✅ 不會上傳到您的伺服器
- ✅ 只在生成時發送到 Google Gemini API
- ✅ 清除瀏覽器資料會刪除所有照片

### API 金鑰保護
- ⚠️ 目前 API 金鑰在前端暴露
- 🔒 生產環境建議：
  - 建立後端代理伺服器
  - 隱藏 API 金鑰
  - 實作使用者認證

## 🐛 常見問題

### Q: 生成失敗怎麼辦？
A: 檢查以下項目：
1. API 金鑰是否正確設定
2. 網路連線是否正常
3. 是否超出每日配額
4. 照片是否符合格式要求

### Q: 可以使用其他 API 嗎？
A: 可以，修改 `src/composables/useNanoBanana.js` 來整合其他 API：
- fal.ai (較便宜的替代方案)
- Together AI
- Leonardo.ai

### Q: 如何部署到生產環境？
A: 執行建置命令後部署到任何靜態託管服務：
```bash
npm run build
# 部署 dist/ 資料夾到:
# - Vercel
# - Netlify
# - GitHub Pages
# - Firebase Hosting
```

### Q: 支援哪些圖片格式？
A: 支援 JPEG、PNG、WebP，最大 30MB

### Q: 照片會被保存多久？
A: 照片永久儲存在瀏覽器本地，除非您手動刪除或清除瀏覽器資料

## 🎨 自定義與擴展

### 修改主題顏色
編輯 `tailwind.config.js` 中的 `primary` 顏色：

```javascript
colors: {
  primary: {
    500: '#你的顏色',
    // ...
  }
}
```

### 添加新功能
建議的擴展方向：
1. **髮型庫**: 預載常見髮型供快速選擇
2. **歷史記錄**: 保存生成歷史
3. **批次處理**: 一次嘗試多種髮型
4. **髮色調整**: 更改髮色
5. **社交分享**: 整合社交媒體

### 修改 AI 提示詞
編輯 `src/composables/useNanoBanana.js` 中的 `prompt` 變數來調整生成效果。

## 📞 支援

遇到問題？
1. 查看瀏覽器 Console 錯誤訊息
2. 檢查 API 回應
3. 確認環境變數設定

## 📄 授權

MIT License

---

**享受您的 AI 髮型模擬器！** 🎉✨
