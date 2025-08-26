<script setup>
const props = defineProps({
  sentences: Array,
  selectedSentence: Number,
  audioReady: Boolean,
  textReady: Boolean
});
const emit = defineEmits(["select", "add", "remove", "mark-start", "mark-end"]);
</script>

<template>
  <div class="p-4 bg-white rounded-2xl shadow">
    <h2 class="font-semibold mb-3">4) Đánh dấu câu</h2>
    <div class="flex items-center gap-2 mb-3">
      <button class="px-3 py-2 rounded-xl bg-indigo-600 text-white"
              :disabled="!audioReady || selectedSentence===null"
              @click="emit('mark-start')">Đánh bắt đầu</button>
      <button class="px-3 py-2 rounded-xl bg-indigo-600 text-white"
              :disabled="!audioReady || selectedSentence===null"
              @click="emit('mark-end')">Đánh kết thúc</button>
      <button class="px-3 py-2 rounded-xl bg-slate-200"
              @click="emit('add')" :disabled="!textReady">+ Thêm câu</button>
      <button class="px-3 py-2 rounded-xl bg-rose-100 text-rose-700"
              @click="emit('remove')" :disabled="selectedSentence===null">Xóa câu</button>
    </div>
    <div v-if="!textReady" class="text-sm text-slate-500">
      Hãy nạp file text .txt. Mỗi dòng dạng: <span class="font-mono">Tên: Nội dung...</span>
    </div>
    <div v-else class="space-y-2 max-h-72 overflow-auto pr-1">
      <div v-for="(sen, idx) in sentences" :key="idx"
           class="p-2 rounded-xl border cursor-pointer"
           :class="selectedSentence===idx ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200'"
           @click="emit('select', idx)">
        <div class="flex items-center justify-between gap-2">
          <div class="text-sm font-semibold">#{{ idx+1 }} — {{ sen.r }}</div>
          <div class="text-xs text-slate-500">{{ sen.t0 ?? '—' }} → {{ sen.t1 ?? '—' }}</div>
        </div>
        <div class="mt-1 text-sm">
          {{ sen.s }}
        </div>
      </div>
    </div>
  </div>
</template>
