<template>
  <div class="home-view min-h-screen bg-gray-50 pb-20">
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
            <button type="button" class="btn-primary text-sm" @click="goToSettings">
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
        <span v-if="!generating">🎨 生成髮型效果</span>
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useImageStorage, PHOTO_KEYS } from '@/composables/useImageStorage'
import { useNanoBanana } from '@/composables/useNanoBanana'
import ImageUploader from '@/components/ImageUploader.vue'
import PhotoPreview from '@/components/PhotoPreview.vue'
import GenerationStatus from '@/components/GenerationStatus.vue'
import ResultDisplay from '@/components/ResultDisplay.vue'

const router = useRouter()
const { getPhoto, savePhoto, deletePhoto, checkRequiredPhotos } = useImageStorage()
const {
  generating,
  progress: generationProgress,
  error: generationError,
  result: generationResult,
  generateHairstyle: generateAPI,
  reset: resetAPI
} = useNanoBanana()

const hairstylePhoto = ref(null)
const frontPhoto = ref(null)
const sidePhoto = ref(null)
const hasRequiredPhotos = ref(false)

const canGenerate = computed(() => {
  return hasRequiredPhotos.value && hairstylePhoto.value && !generating.value
})

onMounted(async () => {
  await checkPhotos()
  await loadHairstylePhoto()
})

const checkPhotos = async () => {
  const status = await checkRequiredPhotos()
  hasRequiredPhotos.value = status.hasRequired

  if (status.hasRequired) {
    frontPhoto.value = await getPhoto(PHOTO_KEYS.FRONT)
    sidePhoto.value = await getPhoto(PHOTO_KEYS.SIDE)
  }
}

const loadHairstylePhoto = async () => {
  hairstylePhoto.value = await getPhoto(PHOTO_KEYS.HAIRSTYLE)
}

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

const goToSettings = () => {
  router.push('/settings')
}

const handleDownload = () => {
  console.log('下載圖片')
}

const handleShare = () => {
  console.log('分享圖片')
}
</script>
