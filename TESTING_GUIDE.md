# API修復測試指南

## ✅ 已完成的修復

### 1. API 認證方式修正
- ❌ 舊方式: 使用 header `x-goog-api-key`
- ✅ 新方式: 使用 query parameter `?key=YOUR_API_KEY`

### 2. 回應解析增強
- ✅ 新增完整的 API 回應日誌
- ✅ 支援多種欄位名稱格式 (`inline_data` 和 `inlineData`)
- ✅ 支援多種 MIME 類型格式 (`mime_type` 和 `mimeType`)
- ✅ 處理文字回應（當 API 無法生成圖片時）
- ✅ 更詳細的錯誤訊息

### 3. 錯誤處理改善
- ✅ 檢查 API 金鑰是否設定
- ✅ 記錄實際的 API 回應結構
- ✅ 提供更清楚的錯誤訊息給使用者

## 🧪 測試步驟

### 步驟 1: 確認 API 金鑰已設定

檢查 `.env.local` 檔案:
```bash
cat .env.local
```

應該看到:
```
VITE_GEMINI_API_KEY=AIzaSyC37GQbP-wlWo_DbFGVKoSikiOCnejWz1U
VITE_API_ENDPOINT=https://generativelanguage.googleapis.com/v1beta
VITE_MODEL_ID=gemini-3-pro-image-preview
```

### 步驟 2: 重新啟動開發伺服器

由於修改了程式碼，需要重新啟動伺服器：

```bash
# 停止當前伺服器 (如果正在運行)
# 在終端機按 Ctrl+C

# 重新啟動
npm run dev
```

### 步驟 3: 開啟瀏覽器開發者工具

1. 打開 Chrome 或 Safari
2. 訪問 http://localhost:3000/
3. 按 F12 或 Cmd+Option+I 開啟開發者工具
4. 切換到 "Console" 標籤

**重要**: 所有除錯訊息都會顯示在 Console 中！

### 步驟 4: 測試完整流程

#### 4.1 上傳個人照片
1. 點擊底部的「設定」按鈕
2. 上傳正面大頭照
3. 上傳側面大頭照
4. 點擊「完成設定」

#### 4.2 嘗試生成髮型
1. 返回「首頁」
2. 上傳想嘗試的髮型參考照片
3. 點擊「生成髮型效果」按鈕
4. **立即查看 Console**

### 步驟 5: 檢查 Console 輸出

在 Console 中，你應該會看到:

#### 成功的情況:
```
發送 API 請求到: /models/gemini-3-pro-image-preview:generateContent
API 完整回應: {
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "inlineData": {
              "mimeType": "image/png",
              "data": "iVBORw0KGgoAAAANSUhEUgAA..."
            }
          }
        ]
      }
    }
  ]
}
找到的 parts: [...]
成功取得圖片資料
```

#### API 返回文字回應的情況:
```
發送 API 請求到: /models/gemini-3-pro-image-preview:generateContent
API 完整回應: {...}
找到的 parts: [...]
API 返回文字回應: I cannot perform style transfer or image manipulation...
```

#### 錯誤的情況:
```
發送 API 請求到: /models/gemini-3-pro-image-preview:generateContent
未預期的 API 回應結構: {...}
Error: API 未返回生成的圖片。請查看 Console 了解詳細資訊。
```

## 📋 除錯檢查清單

### ✅ API 金鑰驗證
- [ ] API 金鑰已正確設定在 `.env.local`
- [ ] 開發伺服器已重新啟動（載入新的環境變數）
- [ ] Console 沒有顯示「未設定 API 金鑰」錯誤

### ✅ 網路請求
- [ ] Console 顯示「發送 API 請求到...」
- [ ] Network 標籤中可以看到請求
- [ ] 請求 URL 包含 `?key=` 參數
- [ ] 請求狀態碼是 200 (成功)

### ✅ API 回應
- [ ] Console 顯示「API 完整回應」
- [ ] 回應包含 `candidates` 陣列
- [ ] `candidates[0].content.parts` 存在
- [ ] 檢查 parts 中的內容類型

## 🔍 常見問題排除

### 問題 1: 「未設定 API 金鑰」錯誤
**解決方案**:
1. 確認 `.env.local` 存在且包含 API 金鑰
2. 重新啟動開發伺服器
3. 清除瀏覽器快取

### 問題 2: API 返回 401 錯誤
**原因**: API 金鑰無效或過期
**解決方案**:
1. 前往 https://aistudio.google.com/
2. 生成新的 API 金鑰
3. 更新 `.env.local`
4. 重新啟動伺服器

### 問題 3: API 返回 403 錯誤
**原因**: 已達每日配額上限
**解決方案**:
1. 等待明天配額重置
2. 或升級 API 方案

### 問題 4: API 返回文字而非圖片
**可能原因**:
1. Gemini 3 Pro Image 可能不支援這種髮型轉換方式
2. 提示詞需要調整
3. 需要使用不同的 API 或方法

**下一步**:
1. 將 Console 中的完整回應截圖或複製
2. 我們可以根據實際回應調整實作方式
3. 可能需要考慮使用 fal.ai 的 Nano Banana Pro

### 問題 5: 圖片太大無法處理
**解決方案**:
- 確保 `useImageCompression.js` 正常運作
- 檢查上傳的圖片是否已壓縮
- 可能需要進一步降低壓縮後的尺寸

## 📊 預期結果

### 最佳情況
- ✅ API 成功回應
- ✅ 返回生成的圖片 base64 資料
- ✅ 圖片顯示在結果頁面
- ✅ 可以下載和分享

### 可接受情況
- ⚠️ API 返回文字解釋為何無法生成
- ⚠️ 我們得知 Gemini API 的限制
- ⚠️ 可以據此調整實作策略

### 需要修正的情況
- ❌ API 認證失敗（401）
- ❌ 網路錯誤
- ❌ 回應格式完全不符預期

## 📸 測試建議

### 測試照片要求
1. **個人照片（正面）**:
   - 清晰、光線充足
   - 直視鏡頭
   - 檔案大小 < 5MB

2. **個人照片（側面）**:
   - 90度側面角度
   - 清楚展示頭部輪廓
   - 檔案大小 < 5MB

3. **髮型參考照片**:
   - 髮型清晰可見
   - 可以是雜誌照片、網路圖片
   - 檔案大小 < 5MB

## 🎯 成功指標

測試成功的判斷標準：

1. **技術層面**:
   - [ ] API 請求成功發送（包含正確的 query parameter）
   - [ ] 收到 200 狀態碼回應
   - [ ] Console 顯示完整的 API 回應結構
   - [ ] 沒有 JavaScript 錯誤

2. **功能層面**:
   - [ ] 如果 API 支援: 成功生成髮型圖片
   - [ ] 如果 API 不支援: 收到清楚的文字說明
   - [ ] 錯誤訊息清楚易懂

## 📝 測試結果回報

測試完成後，請記錄以下資訊：

1. **API 回應狀態碼**: ___
2. **是否收到圖片**: 是 / 否
3. **Console 訊息**: （截圖或複製）
4. **錯誤訊息**（如有）: ___

將這些資訊提供給我，我可以根據實際情況進一步調整程式碼。

## 🔄 下一步計劃

根據測試結果，可能的下一步：

### 如果成功生成圖片
- ✅ 測試不同的髮型參考照片
- ✅ 優化提示詞以改善效果
- ✅ 添加更多功能（髮色調整等）

### 如果 API 回應但無法生成圖片
- 🔄 調整提示詞策略
- 🔄 嘗試簡化請求（只使用正面照）
- 🔄 研究 Gemini API 的圖片編輯功能

### 如果 Gemini API 不支援此功能
- 🔄 切換到 fal.ai 的 Nano Banana Pro API
- 🔄 實作多步驟方法（遮罩 + 修補）
- 🔄 尋找其他專門的髮型轉換 API

---

**準備好了嗎？開始測試吧！** 🚀

記得隨時查看 Console，所有重要資訊都在那裡！
