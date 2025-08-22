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
  <div class="flex items-center px-4 py-3 gap-3">
    <input
      v-model="msg"
      type="text"
      placeholder="Type your message..."
      class="flex-1 h-12 rounded-l-lg px-4 bg-[#e7edf4] text-base focus:outline-none"
      @keyup.enter="handleSend"
    />
    <button
      class="h-12 px-4 bg-[#0d80f2] text-white text-sm font-medium rounded-r-lg"
      @click="handleSend"
    >
      Send
    </button>
  </div>
</template>
