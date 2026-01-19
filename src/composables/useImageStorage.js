import { ref } from 'vue'
import localforage from 'localforage'

// Configure localforage
const storage = localforage.createInstance({
  name: 'haircut-simulator',
  storeName: 'photos',
  description: 'User uploaded photos for hairstyle simulation'
})

// Photo keys
export const PHOTO_KEYS = {
  FRONT: 'photo-a-front',
  SIDE: 'photo-a-side',
  HAIRSTYLE: 'photo-b-hairstyle'
}

export const useImageStorage = () => {
  const loading = ref(false)
  const error = ref(null)

  /**
   * Save photo to IndexedDB
   * @param {string} key - Photo key (from PHOTO_KEYS)
   * @param {string} imageData - Base64 encoded image data
   * @returns {Promise<void>}
   */
  const savePhoto = async (key, imageData) => {
    try {
      loading.value = true
      error.value = null
      await storage.setItem(key, imageData)
    } catch (err) {
      error.value = '儲存照片失敗: ' + err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get photo from IndexedDB
   * @param {string} key - Photo key
   * @returns {Promise<string|null>} Base64 encoded image or null
   */
  const getPhoto = async (key) => {
    try {
      loading.value = true
      error.value = null
      const data = await storage.getItem(key)
      return data
    } catch (err) {
      error.value = '讀取照片失敗: ' + err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete photo from IndexedDB
   * @param {string} key - Photo key
   * @returns {Promise<void>}
   */
  const deletePhoto = async (key) => {
    try {
      loading.value = true
      error.value = null
      await storage.removeItem(key)
    } catch (err) {
      error.value = '刪除照片失敗: ' + err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get all photos
   * @returns {Promise<Object>} Object with all photos
   */
  const getAllPhotos = async () => {
    try {
      loading.value = true
      error.value = null
      const photos = {}
      for (const key of Object.values(PHOTO_KEYS)) {
        photos[key] = await storage.getItem(key)
      }
      return photos
    } catch (err) {
      error.value = '讀取所有照片失敗: ' + err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear all photos
   * @returns {Promise<void>}
   */
  const clearAllPhotos = async () => {
    try {
      loading.value = true
      error.value = null
      await storage.clear()
    } catch (err) {
      error.value = '清除所有照片失敗: ' + err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Check if required photos exist
   * @returns {Promise<Object>} Status of required photos
   */
  const checkRequiredPhotos = async () => {
    try {
      const front = await getPhoto(PHOTO_KEYS.FRONT)
      const side = await getPhoto(PHOTO_KEYS.SIDE)
      return {
        hasFront: !!front,
        hasSide: !!side,
        hasRequired: !!front && !!side
      }
    } catch (err) {
      error.value = '檢查照片失敗: ' + err.message
      return {
        hasFront: false,
        hasSide: false,
        hasRequired: false
      }
    }
  }

  return {
    loading,
    error,
    savePhoto,
    getPhoto,
    deletePhoto,
    getAllPhotos,
    clearAllPhotos,
    checkRequiredPhotos
  }
}
