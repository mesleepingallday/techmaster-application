<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import MessageBubble from './MessageBubble.vue';
import ChatInput from './ChatInput.vue';

interface Message { sender: 'bot' | 'user'; text: string; }

const props = defineProps<{ initialMessages?: Message[] }>();
const emit = defineEmits<{ (e: 'messages-change', messages: Message[]): void }>();

const defaultWelcome: Message[] = [
  { sender: 'bot', text: 'Hello! How can I assist you today?' }
];

const messages = ref<Message[]>(props.initialMessages?.length ? [...props.initialMessages] : [...defaultWelcome]);

const showThink = ref<boolean>(false);

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
      bottomEl.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
      try {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
      } catch {}
    }
  });
}

function processThink(text: string): string {
  if (!text) return '';
  try {
    const replaced = text.replace(/<think>([\s\S]*?)<\/think>/gi, (_m, inner) => {
      if (showThink.value) {
        const content = String(inner ?? '').trim();
        if (!content) return '';
        return `\n\n> 🧠 Think\n\n\`\`\`\n${content}\n\`\`\`\n\n`;
      } else {
        return '';
      }
    });
    return replaced;
  } catch {
    return text;
  }
}

watch(() => props.initialMessages, (val) => {
  messages.value = val?.length ? [...val] : [...defaultWelcome];
  scrollToBottom();
  emit('messages-change', [...messages.value]);
});

watch(() => messages.value.length, () => {
  scrollToBottom();
  emit('messages-change', [...messages.value]);
});

onMounted(() => {
  scrollToBottom();
  emit('messages-change', [...messages.value]);
});

async function sendMessage(newMsg: string) {
  if (!newMsg.trim()) return;
  messages.value.push({ sender: 'user', text: newMsg });
  scrollToBottom(); // 👈 Cuộn sau khi user gửi

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
      })
    });

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? 'No response';
    messages.value.push({ sender: 'bot', text: reply });
    scrollToBottom(); // 👈 Cuộn sau khi bot phản hồi
  } catch {
    messages.value.push({ sender: 'bot', text: 'Server error, please try again.' });
    scrollToBottom(); // 👈 Cuộn nếu lỗi
  }
}

</script>


<template>
  <div class="flex flex-col max-w-[960px] flex-1">
    <div class="flex items-center justify-center pt-5 pb-3 px-4">
      <h2 class="text-[28px] font-bold text-center">Chat with Our AI Assistant</h2>
    </div>
    <p class="text-center text-base pb-3">
      Our chatbot is designed to assist you with various tasks and answer your questions.
    </p>

    <!-- Messages -->
    <div
      ref="containerRef"
      class="flex flex-col gap-2 flex-1 overflow-y-auto px-4 py-3 pb-20"
    >
      <MessageBubble
        v-for="(msg, i) in messages"
        :key="i"
        :sender="msg.sender"
        :text="processThink(msg.text)"
      />
    </div>

    <!-- Input -->
    <ChatInput v-model:showThink="showThink" @send="sendMessage" />
    <!-- Bottom sentinel to ensure page scrolls to the true end of the page -->
    <div ref="bottomRef"></div>
  </div>
</template>
