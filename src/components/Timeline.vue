<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  audioBuffer: Object,
  sentences: Array,
  currentTimeMs: Number,
  durationMs: Number,
  pxPerMs: Number,
  zoom: Number,
  audioReady: Boolean,
  formatMs: Function
});

const emit = defineEmits(["seek", "fit-all"]);

const waveCanvas = ref(null);
const timelineWrap = ref(null);

function chooseGridStep(pxPerMs) {
  const targets = [1,2,5,10,20,50,100,200,500,1000,2000,5000];
  const targetPx = 100;
  let best = 10;
  for (const t of targets) {
    const px = t * pxPerMs;
    if (Math.abs(px - targetPx) < Math.abs(best*pxPerMs - targetPx)) best = t;
  }
  return best;
}
const formatShortMs = (ms) => {
  if (ms < 1000) return ms + 'ms';
  const s = (ms/1000);
  return s.toFixed(s>=10?0:1) + 's';
};

function drawWaveform() {
  if (!props.audioBuffer || !waveCanvas.value) return;
  const wrap = timelineWrap.value;
  const canvas = waveCanvas.value;
  const height = 140;
  const totalWidth = Math.max(
    wrap.clientWidth,
    Math.ceil(props.durationMs * props.pxPerMs) + 40
  );
  canvas.width = totalWidth;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // grid
  const stepMs = chooseGridStep(props.pxPerMs);
  ctx.font = "10px ui-monospace, monospace";
  ctx.fillStyle = "#94a3b8";
  ctx.strokeStyle = "#e2e8f0";
  for (let ms = 0; ms <= props.durationMs; ms += stepMs) {
    const x = Math.floor(ms * props.pxPerMs) + 0.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
    if ((ms / stepMs) % 5 === 0) ctx.fillText(formatShortMs(ms), x + 2, 10);
  }

  // waveform
  const ch = props.audioBuffer.numberOfChannels;
  const len = props.audioBuffer.length;
  const dataL = props.audioBuffer.getChannelData(0);
  const dataR = ch > 1 ? props.audioBuffer.getChannelData(1) : null;

  const midY = height / 2;
  const amp = height * 0.4;
  ctx.strokeStyle = "#0ea5e9";
  ctx.beginPath();
  const samplesPerPx = Math.max(1, Math.floor(len / totalWidth));
  for (let x = 0; x < totalWidth; x++) {
    const start = x * samplesPerPx;
    let min = 1,
      max = -1;
    for (let i = 0; i < samplesPerPx; i++) {
      const l = dataL[start + i] || 0;
      const r = dataR ? dataR[start + i] || 0 : 0;
      const v = (l + r) * 0.5;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    ctx.moveTo(x + 0.5, midY + min * amp);
    ctx.lineTo(x + 0.5, midY + max * amp);
  }
  ctx.stroke();

  // highlight sentences
  ctx.fillStyle = "rgba(16,185,129,0.15)";
  for (const s of props.sentences) {
    if (typeof s.t0 === "number" && typeof s.t1 === "number") {
      const x0 = Math.floor(s.t0 * props.pxPerMs);
      const x1 = Math.floor(s.t1 * props.pxPerMs);
      ctx.fillRect(x0, 0, Math.max(2, x1 - x0), height);
    }
  }
}

function onClickCanvas(e) {
  if (!props.audioReady) return;
  const rect = waveCanvas.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const ms = Math.max(
    0,
    Math.min(props.durationMs, Math.round(x / props.pxPerMs))
  );
  emit("seek", ms);
}

onMounted(() => {
  waveCanvas.value.addEventListener("click", onClickCanvas);
  drawWaveform();
});

watch(() => [props.currentTimeMs, props.zoom, props.sentences], () => {
  drawWaveform();
});
</script>

<template>
  <div class="p-4 bg-white rounded-2xl shadow mb-6">
    <div class="flex items-center justify-between mb-2 gap-3 flex-wrap">
      <h2 class="font-semibold">3) Timeline & phóng to</h2>
      <div class="flex items-center gap-3">
        <label class="text-sm">Zoom: x{{ zoom.toFixed(2) }}</label>
        <button class="px-3 py-2 rounded-xl bg-slate-200"
                @click="emit('fit-all')"
                :disabled="!audioReady">Fit all</button>
      </div>
    </div>
    <div ref="timelineWrap" class="relative overflow-x-auto scrollbar-thin" style="height: 160px;">
      <canvas ref="waveCanvas" class="bg-slate-100 rounded-xl h-full"></canvas>
      <div v-if="audioReady"
           class="pointer-events-none absolute top-0 bottom-0 border-l-2 border-emerald-500"
           :style="{ left: (currentTimeMs * pxPerMs) + 'px' }"></div>
    </div>
    <div class="text-xs text-slate-500 mt-1">Click vào waveform để nhảy tới thời điểm.</div>
  </div>
</template>
