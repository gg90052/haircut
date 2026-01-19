<template>
  <div class="result-view min-h-screen bg-gray-50 pb-20">
    <div class="max-w-2xl mx-auto px-4 py-6">
      <!-- Header -->
      <div class="mb-6">
        <button type="button" class="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4" @click="goBack">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          返回
        </button>
        <h1 class="text-2xl font-bold text-gray-900">髮型效果</h1>
        <p class="text-sm text-gray-600 mt-1">查看您的 AI 生成髮型模擬圖</p>
      </div>

      <!-- Result Display -->
      <div class="card mb-6">
        <ResultDisplay :image-url="resultImageUrl" @download="handleDownload" @share="handleShare" />
      </div>

      <!-- Actions -->
      <div class="space-y-3">
        <button type="button" class="btn-primary w-full" @click="generateAnother">
          生成另一個髮型
        </button>
        <button type="button" class="btn-secondary w-full" @click="goToSettings">
          更新個人照片
        </button>
      </div>

      <!-- Comparison Section (Optional) -->
      <div v-if="showComparison" class="mt-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">前後對比</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600 mb-2 text-center">原始照片</p>
            <img
              v-if="originalPhoto"
              :src="`data:image/jpeg;base64,${originalPhoto}`"
              alt="原始照片"
              class="w-full h-auto rounded-lg shadow-md"
            />
          </div>
          <div>
            <p class="text-sm text-gray-600 mb-2 text-center">新髮型</p>
            <img
              v-if="resultImageUrl"
              :src="resultImageUrl"
              alt="新髮型"
              class="w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useImageStorage, PHOTO_KEYS } from '@/composables/useImageStorage'
import ResultDisplay from '@/components/ResultDisplay.vue'

const router = useRouter()
const route = useRoute()
const { getPhoto } = useImageStorage()

const resultImageUrl = ref(null)
const originalPhoto = ref(null)
const showComparison = ref(true)

onMounted(async () => {
  // Get result from route params or localStorage
  const resultId = route.params.id
  if (resultId) {
    // In a real app, you might fetch from a results store
    // For now, we'll use a placeholder
    resultImageUrl.value = localStorage.getItem(`result-${resultId}`)
  }

  // Load original photo for comparison
  originalPhoto.value = await getPhoto(PHOTO_KEYS.FRONT)
})

const goBack = () => {
  router.back()
}

const goToSettings = () => {
  router.push('/settings')
}

const generateAnother = () => {
  router.push('/')
}

const handleDownload = () => {
  console.log('下載圖片')
}

const handleShare = () => {
  console.log('分享圖片')
}
</script>
