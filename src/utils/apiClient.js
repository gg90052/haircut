import axios from 'axios'

// API 端點：部署 Worker 後請更新此 URL
// 本地開發時使用 localhost，生產環境使用 Worker URL
const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8787'
  : 'https://haircut-api.gg90052.workers.dev'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes for image generation
  headers: {
    'Content-Type': 'application/json'
  }
})

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response

      switch (status) {
        case 401:
          error.message = 'API 金鑰無效，請檢查設定'
          break
        case 403:
          error.message = '已達每日配額上限，請明天再試或升級方案'
          break
        case 429:
          error.message = '請求過於頻繁，請稍後再試'
          break
        case 500:
        case 503:
          error.message = 'API 服務暫時無法使用，請稍後再試'
          break
        default:
          error.message = data?.error?.message || data?.error || '發生未知錯誤'
      }
    } else if (error.request) {
      // Request made but no response
      error.message = '網路連線失敗，請檢查網路連線'
    }

    return Promise.reject(error)
  }
)

export default apiClient
