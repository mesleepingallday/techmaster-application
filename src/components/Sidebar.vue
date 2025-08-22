<script setup>
import { ref } from 'vue'

const chats = ref([
  { id: 1, title: 'Hỏi về tài khoản', createdAt: new Date() },
  { id: 2, title: 'Xin công thức nấu ăn', createdAt: new Date(Date.now() - 1000 * 60) },
])
</script>

<template>
  <div class="p-4 space-y-2 overflow-y-auto h-full">
    <h2 class="text-lg font-bold mb-2">Lịch sử</h2>
    <div v-for="c in chats" :key="c.id" class="p-2 rounded hover:bg-gray-200 cursor-pointer">
      {{ c.title }}
    </div>
  </div>
</template>
