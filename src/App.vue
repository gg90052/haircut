<template>
  <div id="app" class="app">
    <!-- Main Content -->
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div class="max-w-2xl mx-auto px-4">
        <div class="flex justify-around py-2">
          <router-link
            to="/"
            class="nav-item flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors"
            :class="{ 'active': $route.path === '/' }"
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
          </router-link>

          <router-link
            to="/settings"
            class="nav-item flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-colors"
            :class="{ 'active': $route.path === '/settings' }"
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
          </router-link>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup>
// App component - no additional logic needed for now
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
