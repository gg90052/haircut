import { ref } from 'vue'

export const useImageCompression = () => {
  const compressing = ref(false)
  const progress = ref(0)

  /**
   * Compress image file
   * @param {File} file - Original image file
   * @param {Object} options - Compression options
   * @returns {Promise<string>} Base64 encoded compressed image
   */
  const compressImage = async (
    file,
    options = {
      maxWidth: 2048,
      maxHeight: 2048,
      quality: 0.9
    }
  ) => {
    return new Promise((resolve, reject) => {
      compressing.value = true
      progress.value = 0

      const reader = new FileReader()

      reader.onload = (e) => {
        progress.value = 30

        const img = new Image()

        img.onload = () => {
          progress.value = 50

          // Calculate new dimensions
          let { width, height } = img
          const maxWidth = options.maxWidth || 2048
          const maxHeight = options.maxHeight || 2048

          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height

            if (width > height) {
              width = maxWidth
              height = width / aspectRatio
            } else {
              height = maxHeight
              width = height * aspectRatio
            }
          }

          progress.value = 70

          // Create canvas and compress
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          progress.value = 90

          // Get compressed base64
          const mimeType = file.type || 'image/jpeg'
          const quality = options.quality || 0.9
          const base64 = canvas.toDataURL(mimeType, quality)

          progress.value = 100
          compressing.value = false

          // Return base64 without data URL prefix
          resolve(base64.split(',')[1])
        }

        img.onerror = () => {
          compressing.value = false
          reject(new Error('圖片載入失敗'))
        }

        img.src = e.target.result
      }

      reader.onerror = () => {
        compressing.value = false
        reject(new Error('檔案讀取失敗'))
      }

      reader.readAsDataURL(file)
    })
  }

  /**
   * Get image dimensions
   * @param {File} file - Image file
   * @returns {Promise<{width: number, height: number}>}
   */
  const getImageDimensions = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const img = new Image()

        img.onload = () => {
          resolve({ width: img.width, height: img.height })
        }

        img.onerror = reject
        img.src = e.target.result
      }

      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  return {
    compressing,
    progress,
    compressImage,
    getImageDimensions
  }
}
