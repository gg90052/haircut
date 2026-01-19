import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://generativelanguage.googleapis.com/v1beta',
  timeout: 120000, // 2 minutes for image generation
  headers: {
    'Content-Type': 'application/json'
  }
})

// Note: API key is passed as query parameter in individual requests
// Not added here as interceptor to allow flexibility per endpoint

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
          error.message = data?.error?.message || '發生未知錯誤'
      }
    } else if (error.request) {
      // Request made but no response
      error.message = '網路連線失敗，請檢查網路連線'
    }

    return Promise.reject(error)
  }
)

export default apiClient
