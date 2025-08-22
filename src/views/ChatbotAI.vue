<script setup lang="ts">
import ChatWindow from '@/components/ChatWindow.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50" style='font-family: Inter, "Noto Sans", sans-serif;'>
    <Header />
    <main class="flex flex-1 justify-center px-40 py-5">
      <ChatWindow />
    </main>
  </div>
</template>

<style scoped></style>
