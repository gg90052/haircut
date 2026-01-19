<template>
  <div id="app" class="app">
    <!-- Main Content -->
    <main class="main-content">
      <transition name="fade" mode="out-in">
        <!-- Home Tab -->
        <div v-if="currentTab === 'home'" key="home" class="min-h-screen bg-gray-50 pb-20">
          <div class="max-w-2xl mx-auto px-4 py-6">
            <!-- Header -->
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-gray-900">AI髮型模擬器</h1>
              <p class="text-sm text-gray-600 mt-1">上傳您喜歡的髮型照片，AI 將為您生成模擬效果</p>
            </div>

            <!-- Check Required Photos Alert -->
            <div v-if="!hasRequiredPhotos" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div class="flex gap-3">
                <svg
                  class="w-6 h-6 text-yellow-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div class="flex-1">
                  <h3 class="text-sm font-semibold text-yellow-900 mb-1">尚未完成設定</h3>
                  <p class="text-sm text-yellow-800 mb-3">
                    請先上傳您的個人照片（正面及側面），才能開始生成髮型效果
                  </p>
                  <button type="button" class="btn-primary text-sm" @click="currentTab = 'settings'">
                    前往設定
                  </button>
                </div>
              </div>
            </div>

            <!-- Hairstyle Reference Upload -->
            <div class="card mb-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">參考髮型照片</h2>
              <p class="text-sm text-gray-600 mb-4">上傳您想嘗試的髮型照片</p>

              <ImageUploader
                v-if="!hairstylePhoto"
                title="上傳髮型參考照片"
                description="點擊選擇或拖曳照片"
                @upload="handleHairstyleUpload"
              />

              <PhotoPreview
                v-else
                :image-data="hairstylePhoto"
                label="參考髮型"
                @delete="deleteHairstylePhoto"
              />
            </div>

            <!-- Generate Button -->
            <button
              type="button"
              class="btn-primary w-full mb-6"
              :disabled="!canGenerate || generating"
              @click="generateHairstyle"
            >
              <span v-if="!generating">生成髮型效果</span>
              <span v-else class="flex items-center justify-center gap-2">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                生成中...
              </span>
            </button>

            <!-- Generation Status -->
            <GenerationStatus
              v-if="generating || generationError"
              :is-generating="generating"
              :progress="generationProgress"
              :error="generationError"
              @retry="generateHairstyle"
            />

            <!-- Result Display -->
            <div v-if="generationResult" class="card">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">生成結果</h2>
              <ResultDisplay
                :image-url="generationResult"
                @download="handleDownload"
                @share="handleShare"
              />
              <button
                type="button"
                class="btn-secondary w-full mt-4"
                @click="resetGeneration"
              >
                生成新的髮型
              </button>
            </div>

            <!-- Info Box -->
            <div class="bg-gray-100 rounded-lg p-4 mt-6">
              <div class="flex gap-3">
                <svg
                  class="w-6 h-6 text-gray-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div class="flex-1 text-sm text-gray-700">
                  <p class="font-semibold mb-2">使用說明</p>
                  <ul class="space-y-1">
                    <li>• 選擇您喜歡的髮型照片作為參考</li>
                    <li>• AI 會將髮型效果應用到您的照片上</li>
                    <li>• 生成過程需要 10-30 秒</li>
                    <li>• 可以嘗試不同髮型參考照片</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-else-if="currentTab === 'settings'" key="settings" class="min-h-screen bg-gray-50 pb-20">
          <div class="max-w-2xl mx-auto px-4 py-6">
            <!-- Header -->
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-gray-900">個人照片設定</h1>
              <p class="text-sm text-gray-600 mt-1">上傳您的正面及側面大頭照，以便生成髮型效果</p>
            </div>

            <!-- Front Photo -->
            <div class="card mb-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">正面照片</h2>
              <p class="text-sm text-gray-600 mb-4">請上傳清晰的正面大頭照，確保臉部清晰可見</p>

              <PhotoPreview
                v-if="frontPhoto"
                :image-data="frontPhoto"
                label="正面照片"
                @delete="deleteFrontPhoto"
              />

              <ImageUploader
                v-else
                title="上傳正面照片"
                description="點擊選擇或拖曳照片"
                :enable-camera="true"
                @upload="handleFrontUpload"
              />
            </div>

            <!-- Side Photo -->
            <div class="card mb-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">側面照片</h2>
              <p class="text-sm text-gray-600 mb-4">請上傳清晰的側面大頭照，有助於提升效果準確度</p>

              <PhotoPreview
                v-if="sidePhoto"
                :image-data="sidePhoto"
                label="側面照片"
                @delete="deleteSidePhoto"
              />

              <ImageUploader
                v-else
                title="上傳側面照片"
                description="點擊選擇或拖曳照片"
                :enable-camera="true"
                @upload="handleSideUpload"
              />
            </div>

            <!-- Tips -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div class="flex gap-3">
                <svg
                  class="w-6 h-6 text-blue-600 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div class="flex-1">
                  <h3 class="text-sm font-semibold text-blue-900 mb-2">拍攝建議</h3>
                  <ul class="text-sm text-blue-800 space-y-1">
                    <li>• 確保光線充足，臉部清晰</li>
                    <li>• 避免配戴帽子或遮擋物</li>
                    <li>• 正面照：直視鏡頭，表情自然</li>
                    <li>• 側面照：側臉 90 度，展示完整輪廓</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button
                type="button"
                class="btn-secondary flex-1"
                :disabled="!hasPhotos"
                @click="clearAllPhotos"
              >
                清除所有照片
              </button>
              <button
                type="button"
                class="btn-primary flex-1"
                :disabled="!hasRequiredPhotos"
                @click="currentTab = 'home'"
              >
                完成設定
              </button>
            </div>

            <!-- Status Message -->
            <div v-if="statusMessage" class="mt-4 text-center">
              <p class="text-sm" :class="statusMessageClass">{{ statusMessage }}</p>
            </div>
          </div>
        </div>
      </transition>
    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div class="max-w-2xl mx-auto px-4">
        <div class="flex justify-around py-2">
          <button
            type="button"
            class="nav-item flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors"
            :class="{ 'active': currentTab === 'home' }"
            @click="currentTab = 'home'"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span class="text-xs font-medium">首頁</span>
          </button>

          <button
            type="button"
            class="nav-item flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors"
            :class="{ 'active': currentTab === 'settings' }"
            @click="currentTab = 'settings'"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span class="text-xs font-medium">設定</span>
          </button>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useImageStorage, PHOTO_KEYS } from '@/composables/useImageStorage'
import { useNanoBanana } from '@/composables/useNanoBanana'
import ImageUploader from '@/components/ImageUploader.vue'
import PhotoPreview from '@/components/PhotoPreview.vue'
import GenerationStatus from '@/components/GenerationStatus.vue'
import ResultDisplay from '@/components/ResultDisplay.vue'

// Current tab state
const currentTab = ref('home')

// Image storage
const { getPhoto, savePhoto, deletePhoto, clearAllPhotos: clearStorage, checkRequiredPhotos } = useImageStorage()

// Generation API
const {
  generating,
  progress: generationProgress,
  error: generationError,
  result: generationResult,
  generateHairstyle: generateAPI,
  reset: resetAPI
} = useNanoBanana()

// Photo states
const hairstylePhoto = ref(null)
const frontPhoto = ref(null)
const sidePhoto = ref(null)
const hasRequiredPhotos = ref(false)

// Settings status
const statusMessage = ref('')
const statusMessageClass = ref('text-gray-600')

// Computed
const hasPhotos = computed(() => frontPhoto.value || sidePhoto.value)
const canGenerate = computed(() => {
  return hasRequiredPhotos.value && hairstylePhoto.value && !generating.value
})

// Lifecycle
onMounted(async () => {
  await loadAllPhotos()
})

// Methods
const loadAllPhotos = async () => {
  try {
    const status = await checkRequiredPhotos()
    hasRequiredPhotos.value = status.hasRequired

    frontPhoto.value = await getPhoto(PHOTO_KEYS.FRONT)
    sidePhoto.value = await getPhoto(PHOTO_KEYS.SIDE)
    hairstylePhoto.value = await getPhoto(PHOTO_KEYS.HAIRSTYLE)
  } catch (err) {
    console.error('載入照片失敗:', err)
  }
}

// Home tab methods
const handleHairstyleUpload = async ({ base64 }) => {
  try {
    await savePhoto(PHOTO_KEYS.HAIRSTYLE, base64)
    hairstylePhoto.value = base64
  } catch (err) {
    console.error('儲存髮型照片失敗:', err)
  }
}

const deleteHairstylePhoto = async () => {
  try {
    await deletePhoto(PHOTO_KEYS.HAIRSTYLE)
    hairstylePhoto.value = null
  } catch (err) {
    console.error('刪除髮型照片失敗:', err)
  }
}

const generateHairstyle = async () => {
  try {
    await generateAPI({
      front: frontPhoto.value,
      side: sidePhoto.value,
      hairstyle: hairstylePhoto.value
    })
  } catch (err) {
    console.error('生成髮型失敗:', err)
  }
}

const resetGeneration = () => {
  resetAPI()
}

const handleDownload = () => {
  if (generationResult.value) {
    const link = document.createElement('a')
    link.href = generationResult.value
    link.download = 'hairstyle-result.png'
    link.click()
  }
}

const handleShare = async () => {
  if (navigator.share && generationResult.value) {
    try {
      await navigator.share({
        title: 'AI髮型模擬結果',
        text: '看看我的新髮型！',
        url: window.location.href
      })
    } catch (err) {
      console.log('分享取消或失敗')
    }
  }
}

// Settings tab methods
const handleFrontUpload = async ({ base64 }) => {
  try {
    await savePhoto(PHOTO_KEYS.FRONT, base64)
    frontPhoto.value = base64
    hasRequiredPhotos.value = frontPhoto.value && sidePhoto.value
    showStatus('正面照片已儲存', 'success')
  } catch (err) {
    showStatus('儲存正面照片失敗', 'error')
  }
}

const handleSideUpload = async ({ base64 }) => {
  try {
    await savePhoto(PHOTO_KEYS.SIDE, base64)
    sidePhoto.value = base64
    hasRequiredPhotos.value = frontPhoto.value && sidePhoto.value
    showStatus('側面照片已儲存', 'success')
  } catch (err) {
    showStatus('儲存側面照片失敗', 'error')
  }
}

const deleteFrontPhoto = async () => {
  try {
    await deletePhoto(PHOTO_KEYS.FRONT)
    frontPhoto.value = null
    hasRequiredPhotos.value = false
    showStatus('正面照片已刪除', 'success')
  } catch (err) {
    showStatus('刪除照片失敗', 'error')
  }
}

const deleteSidePhoto = async () => {
  try {
    await deletePhoto(PHOTO_KEYS.SIDE)
    sidePhoto.value = null
    hasRequiredPhotos.value = false
    showStatus('側面照片已刪除', 'success')
  } catch (err) {
    showStatus('刪除照片失敗', 'error')
  }
}

const clearAllPhotos = async () => {
  if (!confirm('確定要清除所有照片嗎？')) return

  try {
    await clearStorage()
    frontPhoto.value = null
    sidePhoto.value = null
    hairstylePhoto.value = null
    hasRequiredPhotos.value = false
    showStatus('所有照片已清除', 'success')
  } catch (err) {
    showStatus('清除照片失敗', 'error')
  }
}

const showStatus = (message, type = 'success') => {
  statusMessage.value = message
  statusMessageClass.value = type === 'success' ? 'text-green-600' : 'text-red-600'
  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}
</script>

<style scoped>
.main-content {
  min-height: 100vh;
}

.bottom-nav {
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.nav-item {
  color: #6b7280;
  touch-action: manipulation;
}

.nav-item.active {
  color: #0ea5e9;
  background-color: #f0f9ff;
}

.nav-item:hover {
  color: #0284c7;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
