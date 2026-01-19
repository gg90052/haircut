/**
 * Convert File to base64 string
 * @param {File} file - Image file
 * @returns {Promise<string>} Base64 encoded string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Convert base64 to blob
 * @param {string} base64 - Base64 string
 * @param {string} mimeType - MIME type
 * @returns {Blob}
 */
export const base64ToBlob = (base64, mimeType = 'image/jpeg') => {
  const byteCharacters = atob(base64)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

/**
 * Download image from base64 or URL
 * @param {string} dataUrl - Base64 data URL or image URL
 * @param {string} filename - Download filename
 */
export const downloadImage = (dataUrl, filename = 'hairstyle-result.png') => {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Validate image file
 * @param {File} file - Image file to validate
 * @returns {Object} Validation result
 */
export const validateImageFile = (file) => {
  const maxSize = 30 * 1024 * 1024 // 30MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  if (!file) {
    return { valid: false, error: '請選擇檔案' }
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: '只支援 JPEG、PNG、WebP 格式' }
  }

  if (file.size > maxSize) {
    return { valid: false, error: '檔案大小不能超過 30MB' }
  }

  return { valid: true }
}

/**
 * Get image MIME type from base64
 * @param {string} base64 - Base64 string with data URL prefix
 * @returns {string} MIME type
 */
export const getMimeType = (base64) => {
  if (base64.startsWith('data:')) {
    const match = base64.match(/data:([^;]+);/)
    return match ? match[1] : 'image/jpeg'
  }
  return 'image/jpeg'
}
