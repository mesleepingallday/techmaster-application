<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import markdownItKatex from 'markdown-it-katex'
import hljs from 'highlight.js'

const props = defineProps<{
  sender: 'bot' | 'user'
  text: string
}>()

// Singleton-like Markdown renderer configured with KaTeX and highlight.js
const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: false,
  highlight(code, lang) {
    try {
      if (lang && hljs.getLanguage(lang)) {
        const { value } = hljs.highlight(code, { language: lang, ignoreIllegals: true })
        return `<pre><code class="hljs language-${lang}">${value}</code></pre>`
      }
    } catch {}
    const esc = md.utils.escapeHtml(code)
    return `<pre><code class="hljs">${esc}</code></pre>`
  }
})

md.use(markdownItKatex)

// Ensure links are safe and open in a new tab
const defaultLinkOpen = md.renderer.rules.link_open
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const t = tokens[idx]
  const targetIdx = t.attrIndex('target')
  if (targetIdx < 0) t.attrPush(['target', '_blank'])
  else t.attrs![targetIdx][1] = '_blank'
  const relIdx = t.attrIndex('rel')
  if (relIdx < 0) t.attrPush(['rel', 'noopener nofollow ugc'])
  else t.attrs![relIdx][1] = 'noopener nofollow ugc'
  return (defaultLinkOpen || self.renderToken).call(md.renderer, tokens, idx, options)
}

const rendered = computed(() => md.render(props.text ?? ''))
</script>

<template>
  <div
    class="flex items-end gap-3 p-2"
    :class="sender === 'user' ? 'justify-end' : ''"
  >
    <!-- Bot -->
    <template v-if="sender === 'bot'">
      <div
        class="w-10 h-10 rounded-full bg-cover bg-center shrink-0"
        style='background-image: url("https://i.pravatar.cc/40?img=5");'
      />
      <div class="flex flex-col gap-1 items-start">
        <p class="text-[#49739c] text-[13px]">ChatBot</p>
        <div class="bg-[#e7edf4] text-[#0d141c] rounded-lg px-4 py-3 max-w-[360px] message-content" v-html="rendered"></div>
      </div>
    </template>

    <!-- User -->
    <template v-else>
      <div class="flex flex-col gap-1 items-end">
        <p class="text-[#49739c] text-[13px] text-right">User</p>
        <div class="bg-[#0d80f2] text-white rounded-lg px-4 py-3 max-w-[360px] message-content" v-html="rendered"></div>
      </div>
      <div
        class="w-10 h-10 rounded-full bg-cover bg-center shrink-0"
        style='background-image: url("https://i.pravatar.cc/40?img=3");'
      />
    </template>
  </div>
</template>

<style scoped>
.message-content {
  line-height: 1.6;
  word-wrap: break-word;
}
.message-content :deep(p) {
  margin: 0.25rem 0;
}
.message-content :deep(ul),
.message-content :deep(ol) {
  padding-left: 1.25rem;
  margin: 0.5rem 0;
}
.message-content :deep(pre) {
  overflow-x: auto;
}
.message-content :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
.message-content :deep(a) {
  color: #0d80f2;
  text-decoration: underline;
}
</style>
