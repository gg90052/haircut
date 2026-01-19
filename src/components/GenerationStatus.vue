<template>
  <div class="generation-status">
    <div v-if="isGenerating" class="card">
      <div class="flex flex-col items-center gap-4">
        <div class="relative w-24 h-24">
          <svg class="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              stroke-width="8"
              fill="none"
              class="text-gray-200"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              stroke-width="8"
              fill="none"
              class="text-primary-600 transition-all duration-300"
              :style="circleStyle"
              stroke-linecap="round"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-xl font-bold text-primary-600">{{ progress }}%</span>
          </div>
        </div>

        <div class="text-center">
          <h3 class="text-lg font-semibold text-gray-900">{{ statusMessage }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ subMessage }}</p>
        </div>

        <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            class="bg-primary-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>

        <div class="flex items-center gap-2 text-xs text-gray-500">
          <div class="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-600"></div>
          <span>預計需要 10-30 秒</span>
        </div>
      </div>
    </div>

    <div v-if="error" class="card bg-red-50 border border-red-200">
      <div class="flex items-start gap-3">
        <svg
          class="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-red-900">生成失敗</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
      <button
        v-if="showRetry"
        type="button"
        class="btn-primary w-full mt-4"
        @click="$emit('retry')"
      >
        重試
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isGenerating: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  error: {
    type: String,
    default: null
  },
  showRetry: {
    type: Boolean,
    default: true
  }
})

defineEmits(['retry'])

const circleStyle = computed(() => {
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (props.progress / 100) * circumference
  return {
    strokeDasharray: `${circumference} ${circumference}`,
    strokeDashoffset: offset
  }
})

const statusMessage = computed(() => {
  if (props.progress < 30) return 'AI 分析中...'
  if (props.progress < 50) return '準備生成...'
  if (props.progress < 80) return '生成髮型中...'
  return '即將完成...'
})

const subMessage = computed(() => {
  if (props.progress < 30) return '正在分析您的照片'
  if (props.progress < 50) return '準備髮型轉換'
  if (props.progress < 80) return 'AI 正在創造完美效果'
  return '最後潤色中'
})
</script>
