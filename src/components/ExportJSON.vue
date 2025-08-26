<script setup>
const props = defineProps({
  prettyJSON: String,
  hasSentences: Boolean
});
const emit = defineEmits(["download"]);
</script>

<template>
  <div class="p-4 bg-white rounded-2xl shadow">
    <h2 class="font-semibold mb-2">6) Xuất JSON</h2>
    <div class="flex flex-wrap items-center gap-2 mb-2">
      <button class="px-3 py-2 rounded-xl bg-emerald-600 text-white"
              @click="emit('download')" :disabled="!hasSentences">Tải xuống smithsonian.json</button>
      <span class="text-xs text-slate-500">Định dạng: <span class="font-mono">sentence</span> & <span class="font-mono">word</span>.</span>
    </div>
    <pre class="text-xs bg-slate-50 p-3 rounded-xl border overflow-auto max-h-64">{{ prettyJSON }}</pre>
  </div>
</template>
