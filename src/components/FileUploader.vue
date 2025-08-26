<script setup>
import { ref } from "vue";

const emit = defineEmits(["audio-loaded", "text-loaded"]);
const audioName = ref("");
const textName = ref("");

async function onAudioFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  audioName.value = file.name;
  emit("audio-loaded", file);
}

async function onTextFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  textName.value = file.name;
  const text = await file.text();
  emit("text-loaded", text);
}
</script>

<template>
  <div class="p-4 bg-white rounded-2xl shadow">
    <h2 class="font-semibold mb-2">1) Nạp file</h2>
    <div class="flex flex-col gap-3">
      <label class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer w-fit">
        <input type="file" accept="audio/*" @change="onAudioFile" hidden />
        <span class="text-sm">Chọn audio (.ogg/.mp3...)</span>
      </label>
      <div v-if="audioName" class="text-xs text-slate-500">Đã nạp: {{ audioName }}</div>

      <label class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 cursor-pointer w-fit">
        <input type="file" accept="text/plain" @change="onTextFile" hidden />
        <span class="text-sm">Chọn text (.txt)</span>
      </label>
      <div v-if="textName" class="text-xs text-slate-500">Đã nạp: {{ textName }}</div>
    </div>
  </div>
</template>
