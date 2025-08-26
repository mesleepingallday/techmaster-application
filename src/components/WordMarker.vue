<script setup>
const props = defineProps({
  selectedSentenceObj: Object,
  tokenizedWords: Array,
  activeWordIndex: Number,
  activeWord: Object,
  audioReady: Boolean
});
const emit = defineEmits(["select-word","clear-word","mark-word-start","mark-word-end"]);
</script>

<template>
  <div class="p-4 bg-white rounded-2xl shadow">
    <h2 class="font-semibold mb-3">5) Đánh dấu từ trong câu</h2>
    <div v-if="!selectedSentenceObj" class="text-sm text-slate-500">
      Chọn một câu ở cột bên trái để bắt đầu đánh dấu từ.
    </div>
    <template v-else>
      <div class="text-sm text-slate-500 mb-2">
        Câu đang chọn: <span class="font-semibold">{{ selectedSentenceObj.s }}</span>
      </div>
      <div class="flex items-center gap-2 mb-3">
        <button class="px-3 py-2 rounded-xl bg-amber-600 text-white"
                :disabled="!audioReady || !activeWord"
                @click="emit('mark-word-start')">Đánh bắt đầu từ</button>
        <button class="px-3 py-2 rounded-xl bg-amber-600 text-white"
                :disabled="!audioReady || !activeWord"
                @click="emit('mark-word-end')">Đánh kết thúc từ</button>
        <button class="px-3 py-2 rounded-xl bg-slate-200"
                @click="emit('clear-word')" :disabled="!activeWord">Bỏ chọn từ</button>
      </div>
      <div class="p-2 rounded-xl bg-slate-50 border border-slate-200 max-h-48 overflow-auto">
        <span v-for="(w,i) in tokenizedWords" :key="i"
              class="word-token px-1 py-0.5 rounded hover:bg-amber-100 cursor-pointer"
              :class="{ 'bg-amber-200': activeWordIndex===i }"
              @click="emit('select-word', i)">
          {{ w.token }}
        </span>
      </div>
      <div class="mt-3 text-xs text-slate-500">
        Từ đang chọn: <span class="font-mono">{{ activeWord?.token || '—' }}</span>.
        Thời điểm: {{ activeWord?.t0 ?? '—' }} → {{ activeWord?.t1 ?? '—' }}
      </div>
    </template>
  </div>
</template>
