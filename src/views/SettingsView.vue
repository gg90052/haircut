<template>
  <div class="settings-view min-h-screen bg-gray-50 pb-20">
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
          @click="goToHome"
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useImageStorage, PHOTO_KEYS } from '@/composables/useImageStorage'
import ImageUploader from '@/components/ImageUploader.vue'
import PhotoPreview from '@/components/PhotoPreview.vue'

const router = useRouter()
const { savePhoto, getPhoto, deletePhoto, clearAllPhotos: clearStorage } = useImageStorage()

const frontPhoto = ref(null)
const sidePhoto = ref(null)
const statusMessage = ref('')
const statusMessageClass = ref('text-gray-600')

const hasPhotos = computed(() => frontPhoto.value || sidePhoto.value)
const hasRequiredPhotos = computed(() => frontPhoto.value && sidePhoto.value)

onMounted(async () => {
  await loadPhotos()
})

const loadPhotos = async () => {
  try {
    frontPhoto.value = await getPhoto(PHOTO_KEYS.FRONT)
    sidePhoto.value = await getPhoto(PHOTO_KEYS.SIDE)
  } catch (err) {
    showStatus('載入照片失敗', 'error')
  }
}

const handleFrontUpload = async ({ base64 }) => {
  try {
    await savePhoto(PHOTO_KEYS.FRONT, base64)
    frontPhoto.value = base64
    showStatus('正面照片已儲存', 'success')
  } catch (err) {
    showStatus('儲存正面照片失敗', 'error')
  }
}

const handleSideUpload = async ({ base64 }) => {
  try {
    await savePhoto(PHOTO_KEYS.SIDE, base64)
    sidePhoto.value = base64
    showStatus('側面照片已儲存', 'success')
  } catch (err) {
    showStatus('儲存側面照片失敗', 'error')
  }
}

const deleteFrontPhoto = async () => {
  try {
    await deletePhoto(PHOTO_KEYS.FRONT)
    frontPhoto.value = null
    showStatus('正面照片已刪除', 'success')
  } catch (err) {
    showStatus('刪除照片失敗', 'error')
  }
}

const deleteSidePhoto = async () => {
  try {
    await deletePhoto(PHOTO_KEYS.SIDE)
    sidePhoto.value = null
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
    showStatus('所有照片已清除', 'success')
  } catch (err) {
    showStatus('清除照片失敗', 'error')
  }
}

const goToHome = () => {
  router.push('/')
}

const showStatus = (message, type = 'success') => {
  statusMessage.value = message
  statusMessageClass.value = type === 'success' ? 'text-green-600' : 'text-red-600'
  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}
</script>
