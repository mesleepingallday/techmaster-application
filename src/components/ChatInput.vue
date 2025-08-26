<script setup lang="ts">
import { ref } from 'vue'

const msg = ref('')
const emit = defineEmits<{
  (e: 'send', message: string): void
}>()

function handleSend() {
  if (!msg.value.trim()) return
  emit('send', msg.value)
  msg.value = ''
}
</script>

<template>
  <!-- Fixed footer with backdrop and shadow -->
  <div class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-10">
    <!-- Centered input box -->
    <div class="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
      <input
        v-model="msg"
        type="text"
        placeholder="Type your message..."
        class="flex-1 h-12 rounded-md px-4 bg-[#f0f2f5] text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keyup.enter="handleSend"
      />
      <button
        class="h-12 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md"
        @click="handleSend"
      >
        Send
      </button>
    </div>
  </div>
</template>
