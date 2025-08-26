<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import ChatWindow from '@/components/ChatWindow.vue'
import ChatbotSidebar, { type Conversation, type Message } from '@/components/ChatbotSidebar.vue'

const STORAGE_KEY = 'chat_conversations'

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function saveConversations(list: Conversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function newConversation(): Conversation {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  return {
    id,
    title: 'New chat',
    createdAt: Date.now(),
    messages: [
      { sender: 'bot', text: 'Hello! How can I assist you today?' }
    ]
  }
}

const conversations = ref<Conversation[]>(loadConversations())
const currentId = ref<string | null>(conversations.value[0]?.id ?? null)

if (conversations.value.length === 0) {
  const c = newConversation()
  conversations.value.push(c)
  currentId.value = c.id
  saveConversations(conversations.value)
}

const currentConv = computed(() =>
  conversations.value.find(c => c.id === currentId.value) || conversations.value[0]
)

watch(conversations, (v) => saveConversations(v), { deep: true })

function handleSelect(id: string) {
  currentId.value = id
}

function handleNew() {
  const c = newConversation()
  conversations.value.unshift(c)
  currentId.value = c.id
}

function handleDelete(id: string) {
  const idx = conversations.value.findIndex(c => c.id === id)
  if (idx !== -1) {
    conversations.value.splice(idx, 1)
    if (currentId.value === id) {
      currentId.value = conversations.value[0]?.id ?? null
    }
  }
}

function handleClear() {
  conversations.value = []
  const c = newConversation()
  conversations.value.push(c)
  currentId.value = c.id
}

function handleMessagesChange(msgs: Message[]) {
  const conv = currentConv.value
  if (!conv) return
  conv.messages = [...msgs]
  // Set a better title from first user message
  const firstUser = conv.messages.find(m => m.sender === 'user')?.text
  if (firstUser) {
    conv.title = firstUser.length > 30 ? firstUser.slice(0, 30) + '…' : firstUser
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex" style="font-family: Inter, 'Noto Sans', sans-serif;">
    <!-- Sidebar fixed như ChatGPT -->
    <aside class="fixed top-0 left-0 w-64 h-screen border-r border-gray-200 bg-white z-10">
      <ChatbotSidebar
        :conversations="conversations"
        :current-id="currentId"
        @select="handleSelect"
        @new="handleNew"
        @delete="handleDelete"
        @clear="handleClear"
      />
    </aside>

    <!-- Nội dung chat dịch sang phải (bằng chiều rộng sidebar) -->
    <main class="ml-64 flex-1 flex flex-col items-center px-6 py-8">
      <div class="w-full max-w-[960px]">
        <ChatWindow
          v-if="currentConv"
          :key="currentConv.id"
          :initial-messages="currentConv.messages"
          @messages-change="handleMessagesChange"
        />
      </div>
    </main>
  </div>
</template>

