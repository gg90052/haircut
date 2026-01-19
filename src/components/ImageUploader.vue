<template>
  <div class="image-uploader">
    <!-- 從相簿選擇 -->
    <input
      ref="fileInput"
      type="file"
      class="input-file"
      accept="image/jpeg,image/jpg,image/png,image/webp"
      @change="handleFileSelect"
    />
    <!-- 拍照用 -->
    <input
      ref="cameraInput"
      type="file"
      class="input-file"
      accept="image/jpeg,image/jpg,image/png,image/webp"
      capture="environment"
      @change="handleFileSelect"
    />

    <div
      v-if="!preview"
      class="upload-area"
      :class="{ active: isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <div class="flex flex-col items-center gap-4">
        <svg
          class="w-16 h-16 text-gray-400"
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
        <div>
          <p class="text-lg font-medium text-gray-700">{{ title }}</p>
          <p class="text-sm text-gray-500 mt-1">{{ description }}</p>
        </div>
        <!-- 兩個按鈕：拍照 / 選擇照片 -->
        <div class="flex gap-3 mt-2">
          <button
            type="button"
            class="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            @click="openCamera"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            拍照
          </button>
          <button
            type="button"
            class="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            @click="openFileDialog"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            選擇照片
          </button>
        </div>
        <p class="text-xs text-gray-400">支援 JPEG、PNG、WebP (最大 30MB)</p>
      </div>
    </div>

    <div v-else class="relative">
      <img :src="preview" :alt="title" class="w-full h-auto rounded-lg" />
      <button
        type="button"
        class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
        @click="removeImage"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <div v-if="compressing" class="mt-4">
      <div class="flex items-center gap-2 text-sm text-gray-600">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
        <span>壓縮中... {{ compressionProgress }}%</span>
      </div>
    </div>

    <p v-if="errorMessage" class="mt-2 text-sm text-red-600">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useImageCompression } from '@/composables/useImageCompression'
import { validateImageFile } from '@/utils/imageHelpers'

const props = defineProps({
  title: {
    type: String,
    default: '上傳照片'
  },
  description: {
    type: String,
    default: '點擊或拖曳照片到此處'
  },
  enableCamera: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'upload'])

const fileInput = ref(null)
const cameraInput = ref(null)
const preview = ref(props.modelValue)
const isDragging = ref(false)
const errorMessage = ref('')

const { compressing, progress: compressionProgress, compressImage } = useImageCompression()

const openFileDialog = () => {
  fileInput.value?.click()
}

const openCamera = () => {
  cameraInput.value?.click()
}

const handleFileSelect = async (event) => {
  const file = event.target.files?.[0]
  if (file) {
    await processFile(file)
  }
}

const handleDrop = async (event) => {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    await processFile(file)
  }
}

const processFile = async (file) => {
  errorMessage.value = ''

  // Validate file
  const validation = validateImageFile(file)
  if (!validation.valid) {
    errorMessage.value = validation.error
    return
  }

  try {
    // Compress image
    const base64 = await compressImage(file)

    // Create preview
    preview.value = `data:${file.type};base64,${base64}`

    // Emit events
    emit('update:modelValue', base64)
    emit('upload', {
      base64,
      file,
      preview: preview.value
    })
  } catch (err) {
    errorMessage.value = '圖片處理失敗: ' + err.message
  }
}

const removeImage = () => {
  preview.value = null
  errorMessage.value = ''
  emit('update:modelValue', null)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  if (cameraInput.value) {
    cameraInput.value.value = ''
  }
}
</script>
