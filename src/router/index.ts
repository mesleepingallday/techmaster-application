import { createRouter, createWebHistory } from 'vue-router'
import HighlightDialog from '@/views/HighlightDialog.vue'
import ChatbotAI from '@/views/ChatbotAI.vue'
import AdvancedChatbot from '@/views/AdvancedChatbot.vue'
import TimestampHighlight from '@/views/TimestampHighlight.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/bai-1',
      component: HighlightDialog,
    },
    {
      path: '/bai-2',
      component: ChatbotAI,
    },
    {
      path: '/bai-3',
      component: AdvancedChatbot,
    },
    {
      path: '/bai-4',
      component: TimestampHighlight,
    },
  ],
})

export default router
