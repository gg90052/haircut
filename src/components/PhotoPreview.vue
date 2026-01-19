<template>
  <div class="photo-preview">
    <div v-if="imageData" class="relative group">
      <img
        :src="`data:image/jpeg;base64,${imageData}`"
        :alt="label"
        class="w-full h-auto rounded-lg shadow-md"
      />
      <div
        v-if="showDelete"
        class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-lg flex items-center justify-center"
      >
        <button
          type="button"
          class="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
          @click="handleDelete"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          刪除
        </button>
      </div>
    </div>

    <div v-else class="empty-state bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
      <svg
        class="w-12 h-12 text-gray-400 mx-auto mb-2"
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
      <p class="text-sm text-gray-500">{{ emptyText }}</p>
    </div>

    <p v-if="label" class="text-sm text-gray-600 mt-2 text-center font-medium">{{ label }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  imageData: {
    type: String,
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  emptyText: {
    type: String,
    default: '尚未上傳照片'
  },
  showDelete: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['delete'])

const handleDelete = () => {
  emit('delete')
}
</script>
