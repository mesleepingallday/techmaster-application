<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import MessageBubble from './MessageBubble.vue';
import ChatInput from './ChatInput.vue';

interface Message { sender: 'bot' | 'user'; text: string; }

const messages = ref<Message[]>([
  { sender: 'bot', text: 'Hello! How can I assist you today?' }
]);

// Refs
const containerRef = ref<HTMLElement | null>(null);
const bottomRef = ref<HTMLElement | null>(null);

function scrollToBottom() {
  nextTick(() => {
    const el = containerRef.value;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
    const bottomEl = bottomRef.value;
    if (bottomEl) {
      // Ensure the viewport also scrolls to the very bottom of the page
      bottomEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
      // Fallback: scroll the window to the bottom
      try {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      } catch {}
    }
  });
}

// Auto-scroll when messages length changes (user sends or bot replies)
watch(() => messages.value.length, () => {
  scrollToBottom();
});

// Also scroll on initial mount
onMounted(() => {
  scrollToBottom();
});

async function sendMessage(newMsg: string) {
  if (!newMsg.trim()) return;
  messages.value.push({ sender: 'user', text: newMsg });

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'user', content: newMsg }],
        temperature: 0.5,
        max_tokens: 1024,
        stream: false
      })
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? 'No response';
    messages.value.push({ sender: 'bot', text: reply });
  } catch {
    messages.value.push({ sender: 'bot', text: 'Server error, please try again.' });
  }
}
</script>


<template>
  <div class="flex flex-col max-w-[960px] flex-1">
    <h2 class="text-[28px] font-bold text-center pt-5 pb-3">Chat with Our AI Assistant</h2>
    <p class="text-center text-base pb-3">
      Our chatbot is designed to assist you with various tasks and answer your questions.
    </p>

    <!-- Messages -->
    <div ref="containerRef" class="flex flex-col gap-2 flex-1 overflow-y-auto px-4 py-3">
      <MessageBubble
        v-for="(msg, i) in messages"
        :key="i"
        :sender="msg.sender"
        :text="msg.text"
      />
    </div>

    <!-- Input -->
    <ChatInput @send="sendMessage" />
    <!-- Bottom sentinel to ensure page scrolls to the true end of the page -->
    <div ref="bottomRef"></div>
  </div>
</template>
