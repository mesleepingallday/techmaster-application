<script setup>
const props = defineProps({
  audioReady: Boolean,
  isPlaying: Boolean,
  currentTimeMs: Number,
  durationMs: Number,
  formatMs: Function
});

const emit = defineEmits(["play-toggle", "stop", "scrub"]);
</script>

<template>
  <div class="p-4 bg-white rounded-2xl shadow">
    <h2 class="font-semibold mb-2">2) Điều khiển phát</h2>
    <div class="flex items-center gap-2 mb-2">
      <button class="px-3 py-2 rounded-xl bg-emerald-600 text-white"
              @click="emit('play-toggle')"
              :disabled="!audioReady">
        {{ isPlaying ? "Tạm dừng" : "Phát" }}
      </button>
      <button class="px-3 py-2 rounded-xl bg-slate-200"
              @click="emit('stop')"
              :disabled="!audioReady">Dừng</button>
      <div class="text-xs text-slate-500 ml-2">
        {{ formatMs(currentTimeMs) }} / {{ formatMs(durationMs) }}
      </div>
    </div>
    <input type="range" min="0" :max="durationMs" step="1"
           class="w-full"
           :value="currentTimeMs"
           @input="emit('scrub',$event)" :disabled="!audioReady" />
  </div>
</template>
