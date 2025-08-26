<script setup lang="ts">
import { ref, reactive } from "vue";
import FileUploader from "@/components/FileUploader.vue";
import AudioControls from "@/components/AudioControls.vue";
import Timeline from "@/components/Timeline.vue";
import SentenceList from "@/components/SentenceList.vue";
import WordMarker from "@/components/WordMarker.vue";
import ExportJSON from "@/components/ExportJSON.vue";
import HighlightPreview from "@/components/HighlightPreview.vue";

// ==================== STATE ====================
const audioRef = ref(null);
const audioCtx = ref(null);
const audioBuffer = ref(null);
const analyser = ref(null);
const currentTimeMs = ref(0);
const durationMs = ref(0);
const isPlaying = ref(false);
const zoom = ref(1);

const sentences = reactive([]); // [{text,start,end,id}]
const words = reactive([]);     // [{text,start,end,sentenceId,id}]

const selectedSentenceId = ref(null);
const selectedWordId = ref(null);

const prettyJSON = ref("");

// ==================== HELPERS ====================
const formatMs = (ms) => {
  if (!ms) return "0:00.000";
  let s = Math.floor(ms / 1000);
  let m = Math.floor(s / 60);
  s = s % 60;
  let msPart = (ms % 1000).toString().padStart(3, "0");
  return `${m}:${s.toString().padStart(2, "0")}.${msPart}`;
};

function updateJSON() {
  prettyJSON.value = JSON.stringify({ sentences, words }, null, 2);
}

// ==================== FILE LOAD ====================
async function onAudioLoaded(file) {
  audioRef.value = new Audio(URL.createObjectURL(file));
  audioRef.value.controls = false;
  audioRef.value.addEventListener("timeupdate", () => {
    currentTimeMs.value = Math.floor(audioRef.value.currentTime * 1000);
  });
  audioRef.value.addEventListener("loadedmetadata", () => {
    durationMs.value = Math.floor(audioRef.value.duration * 1000);
  });

  audioCtx.value = new AudioContext();
  const src = audioCtx.value.createMediaElementSource(audioRef.value);
  analyser.value = audioCtx.value.createAnalyser();
  src.connect(analyser.value);
  analyser.value.connect(audioCtx.value.destination);

  const arrBuffer = await file.arrayBuffer();
  audioBuffer.value = await audioCtx.value.decodeAudioData(arrBuffer);
}

function onTextLoaded(text) {
  sentences.splice(0);
  words.splice(0);

  text.split("\n").forEach((line, i) => {
    if (!line.trim()) return;
    const sid = Date.now() + i;
    sentences.push({ id: sid, text: line.trim(), start: 0, end: 0 });
    line.split(" ").forEach((w, j) => {
      words.push({ id: `${sid}-${j}`, text: w, start: 0, end: 0, sentenceId: sid });
    });
  });
  updateJSON();
}

// ==================== AUDIO CONTROLS ====================
function togglePlay() {
  if (!audioRef.value) return;
  if (isPlaying.value) {
    audioRef.value.pause();
  } else {
    audioRef.value.play();
    audioCtx.value.resume();
  }
  isPlaying.value = !isPlaying.value;
}

function stopAudio() {
  if (!audioRef.value) return;
  audioRef.value.pause();
  audioRef.value.currentTime = 0;
  isPlaying.value = false;
}

function scrub(e) {
  if (!audioRef.value) return;
  const ms = parseInt(e.target.value);
  audioRef.value.currentTime = ms / 1000;
  currentTimeMs.value = ms;
}

// ==================== TIMELINE EVENTS ====================
function onSeek(ms) {
  if (!audioRef.value) return;
  audioRef.value.currentTime = ms / 1000;
  currentTimeMs.value = ms;
}

// ==================== SENTENCE EVENTS ====================
function onSelectSentence(id) {
  selectedSentenceId.value = id;
  selectedWordId.value = null;
}
function onUpdateSentence(payload) {
  const idx = sentences.findIndex(s => s.id === payload.id);
  if (idx !== -1) {
    Object.assign(sentences[idx], payload);
    updateJSON();
  }
}
function onDeleteSentence(id) {
  const idx = sentences.findIndex(s => s.id === id);
  if (idx !== -1) {
    sentences.splice(idx, 1);
    for (let i = words.length - 1; i >= 0; i--) {
      if (words[i].sentenceId === id) words.splice(i, 1);
    }
    updateJSON();
  }
}

// ==================== WORD EVENTS ====================
function onSelectWord(id) {
  selectedWordId.value = id;
}
function onUpdateWord(payload) {
  const idx = words.findIndex(w => w.id === payload.id);
  if (idx !== -1) {
    Object.assign(words[idx], payload);
    updateJSON();
  }
}

// ==================== EXPORT ====================
function onExport() {
  const blob = new Blob([prettyJSON.value], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "transcript.json";
  a.click();
}
</script>

<template>
  <div class="max-w-6xl mx-auto p-4 space-y-4">
    <!-- Upload -->
    <FileUploader @audio-loaded="onAudioLoaded" @text-loaded="onTextLoaded" />

    <!-- Audio controls -->
    <AudioControls
      :audioReady="!!audioRef"
      :isPlaying="isPlaying"
      :currentTimeMs="currentTimeMs"
      :durationMs="durationMs"
      :formatMs="formatMs"
      @play-toggle="togglePlay"
      @stop="stopAudio"
      @scrub="scrub"
    />

    <!-- Timeline -->
    <Timeline
      :audioBuffer="audioBuffer"
      :sentences="sentences"
      :currentTimeMs="currentTimeMs"
      :zoom="zoom"
      @seek="onSeek"
    />

    <!-- Sentence list -->
    <SentenceList
      :sentences="sentences"
      :currentTimeMs="currentTimeMs"
      :selectedSentenceId="selectedSentenceId"
      @select="onSelectSentence"
      @update="onUpdateSentence"
      @delete="onDeleteSentence"
    />

    <!-- Word marker -->
    <WordMarker
      :words="words"
      :sentenceId="selectedSentenceId"
      :currentTimeMs="currentTimeMs"
      :selectedWordId="selectedWordId"
      @select="onSelectWord"
      @update="onUpdateWord"
    />

    <!-- Highlight preview -->
    <HighlightPreview
      :sentences="sentences"
      :words="words"
      :currentTimeMs="currentTimeMs"
    />

    <!-- Export JSON -->
    <ExportJSON :prettyJSON="prettyJSON" @export="onExport" />
  </div>
</template>
