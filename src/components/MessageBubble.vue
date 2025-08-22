<script setup lang="ts">
defineProps<{
  sender: 'bot' | 'user'
  text: string
}>()
</script>

<template>
  <div
    class="flex items-end gap-3 p-2"
    :class="sender === 'user' ? 'justify-end' : ''"
  >
    <!-- Bot -->
    <template v-if="sender === 'bot'">
      <div
        class="w-10 h-10 rounded-full bg-cover bg-center shrink-0"
        style='background-image: url("https://i.pravatar.cc/40?img=5");'
      />
      <div class="flex flex-col gap-1 items-start">
        <p class="text-[#49739c] text-[13px]">ChatBot</p>
        <p class="bg-[#e7edf4] text-[#0d141c] rounded-lg px-4 py-3 max-w-[360px]">
          {{ text }}
        </p>
      </div>
    </template>

    <!-- User -->
    <template v-else>
      <div class="flex flex-col gap-1 items-end">
        <p class="text-[#49739c] text-[13px] text-right">User</p>
        <p class="bg-[#0d80f2] text-white rounded-lg px-4 py-3 max-w-[360px]">
          {{ text }}
        </p>
      </div>
      <div
        class="w-10 h-10 rounded-full bg-cover bg-center shrink-0"
        style='background-image: url("https://i.pravatar.cc/40?img=3");'
      />
    </template>
  </div>
</template>
