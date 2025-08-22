<script setup lang="ts">
import { computed } from 'vue'

export interface Message { sender: 'bot' | 'user'; text: string }
export interface Conversation {
  id: string
  title: string
  createdAt: number
  messages: Message[]
}

const props = defineProps<{
  conversations: Conversation[]
  currentId: string | null
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
  (e: 'new'): void
  (e: 'delete', id: string): void
  (e: 'clear'): void
}>()

const sorted = computed(() =>
  [...props.conversations].sort((a, b) => b.createdAt - a.createdAt)
)

function preview(conv: Conversation) {
  const firstUser = conv.messages.find(m => m.sender === 'user')?.text || ''
  const firstBot = conv.messages.find(m => m.sender === 'bot')?.text || ''
  const text = firstUser || firstBot || ''
  return text.length > 40 ? text.slice(0, 40) + '…' : text
}
</script>

<template>
  <div class="h-full flex flex-col">
    <div class="p-3 border-b border-gray-200 flex items-center justify-between">
      <h3 class="font-semibold">Conversations</h3>
      <button
        class="text-sm px-2 py-1 bg-blue-600 text-white rounded"
        @click="emit('new')"
      >New</button>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div
        v-for="c in sorted"
        :key="c.id"
        class="px-3 py-2 cursor-pointer border-b border-gray-100 group"
        :class="c.id === props.currentId ? 'bg-blue-50' : 'hover:bg-gray-100'"
        @click="emit('select', c.id)"
      >
        <div class="flex items-center justify-between gap-2">
          <div class="flex-1">
            <div class="font-medium text-sm truncate">{{ c.title || 'Untitled' }}</div>
            <div class="text-xs text-gray-500 truncate">{{ preview(c) }}</div>
          </div>
          <button
            class="opacity-0 group-hover:opacity-100 text-xs text-red-600 px-2 py-1"
            @click.stop="emit('delete', c.id)"
          >Delete</button>
        </div>
      </div>

      <div v-if="sorted.length === 0" class="p-4 text-sm text-gray-500">
        No conversations yet. Click "New" to start.
      </div>
    </div>

    <div class="p-3 border-t border-gray-200">
      <button
        class="w-full text-sm text-gray-600 hover:text-red-700"
        @click="emit('clear')"
      >Clear all history</button>
    </div>
  </div>
</template>

<style scoped>
</style>
