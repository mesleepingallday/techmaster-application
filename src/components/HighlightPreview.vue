<script setup>
const props = defineProps({
  sentences: Array,
  words: Array,
  currentTimeMs: Number,
  highlightSentenceClass: Function,
  tokenizeSentence: Function,
  highlightWordClass: Function,
  audioReady: Boolean,
  isPlaying: Boolean
});
const emit = defineEmits(["play-toggle","stop"]);
</script>

<template>
  <div class="p-4 bg-white rounded-2xl shadow">
    <h2 class="font-semibold mb-2">7) Phát & highlight</h2>
    <div class="flex items-center gap-2 mb-2">
      <button class="px-3 py-2 rounded-xl bg-emerald-600 text-white"
              @click="emit('play-toggle')" :disabled="!audioReady">{{ isPlaying ? 'Tạm dừng' : 'Phát' }}</button>
      <button class="px-3 py-2 rounded-xl bg-slate-200"
              @click="emit('stop')" :disabled="!audioReady">Dừng</button>
    </div>
    <div class="p-3 rounded-xl bg-slate-50 border max-h-48 overflow-auto leading-relaxed">
      <template v-for="(sen,i) in sentences" :key="'pv-'+i">
        <span :class="highlightSentenceClass(i)" class="px-1 rounded">
          <strong class="text-slate-600">{{ sen.r }}:</strong>
          <template v-for="(tok,j) in tokenizeSentence(sen.s, sen.bOffset)" :key="'pvw-'+i+'-'+j">
            <span :class="highlightWordClass(tok)" class="px-0.5">{{ tok.token }}</span>
            <span> </span>
          </template>
        </span>
        <span> </span>
      </template>
    </div>
  </div>
</template>
