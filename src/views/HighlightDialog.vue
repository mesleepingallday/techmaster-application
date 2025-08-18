<script setup lang="ts">
import { ref, onMounted } from 'vue'
import dialogData from '@/assets/jameslan.json'

const audioRef = ref<HTMLAudioElement | null>(null)
const currentTime = ref(0)

const sentences = dialogData.sentence
const words = dialogData.word

onMounted(() => {
  if (audioRef.value) {
    audioRef.value.addEventListener('timeupdate', () => {
      currentTime.value = audioRef.value!.currentTime * 1000 // ms
    })
  }
})

const isActiveWord = (word: any) => {
  const now = currentTime.value
  const [start, duration] = word
  return now >= start && now < start + duration
}

const isActiveSentence = (sentence: any) => {
  const now = currentTime.value
  return now >= sentence.start && now < sentence.end
}

const isOdd = (index: number) => index % 2 === 1
</script>

<template>
  <div class="container">
    <audio ref="audioRef" controls>
      <source src="@/assets/jameslan.ogg" type="audio/mpeg" />
    </audio>

    <div class="sentences">
      <div
        v-for="(sen, i) in sentences"
        :key="sen.t0"
        class="sentence"
        :class="{ active: isActiveSentence(sen), bold: isOdd(i) }"
      >
        <span
          v-for="(w, wi) in words.filter(word => word[0] >= sen.t0 && word[0] < sen.t1)"
          :key="wi"
          class="word"
          :class="{ active: isActiveWord(w) }"
        >
          {{ w[2] }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 16px;
  font-family: sans-serif;
}

.sentences {
  margin-top: 12px;
}

.sentence {
  padding: 8px;
  border-radius: 4px;
  color: #333;
  transition: background 0.3s, font-weight 0.3s;
}

.sentence.active {
  background: #fff3b0;
  font-weight: bold;
}

.sentence.bold {
  color: #0070F0;
}

.word {
  margin-right: 4px;
  transition: background 0.2s, color 0.2s;
  border-radius: 4px;
}

.word.active {
  background: #ffdd57;
  color: black;
}
</style>
