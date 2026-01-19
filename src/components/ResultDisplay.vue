<template>
  <div class="result-display">
    <div v-if="imageUrl" class="space-y-4">
      <div class="relative">
        <img
          :src="imageUrl"
          alt="生成的髮型效果圖"
          class="w-full h-auto rounded-xl shadow-lg"
        />
      </div>

      <div class="flex gap-3">
        <button type="button" class="btn-primary flex-1 flex items-center justify-center gap-2" @click="handleDownload">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          下載圖片
        </button>

        <button
          v-if="showShare && canShare"
          type="button"
          class="btn-secondary flex items-center justify-center gap-2"
          @click="handleShare"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          分享
        </button>
      </div>
    </div>

    <div v-else class="card bg-gray-50 text-center py-12">
      <svg
        class="w-16 h-16 text-gray-400 mx-auto mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <p class="text-gray-500">尚未生成髮型效果圖</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { downloadImage } from '@/utils/imageHelpers'

const props = defineProps({
  imageUrl: {
    type: String,
    default: null
  },
  showShare: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['download', 'share'])

const canShare = computed(() => {
  return navigator.share !== undefined
})

const handleDownload = () => {
  if (props.imageUrl) {
    const timestamp = new Date().getTime()
    downloadImage(props.imageUrl, `hairstyle-${timestamp}.png`)
    emit('download', props.imageUrl)
  }
}

const handleShare = async () => {
  if (!canShare.value || !props.imageUrl) return

  try {
    // Convert data URL to blob
    const response = await fetch(props.imageUrl)
    const blob = await response.blob()
    const file = new File([blob], 'hairstyle.png', { type: 'image/png' })

    await navigator.share({
      title: 'AI髮型模擬效果',
      text: '看看我用AI生成的新髮型！',
      files: [file]
    })

    emit('share')
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('分享失敗:', err)
    }
  }
}
</script>
