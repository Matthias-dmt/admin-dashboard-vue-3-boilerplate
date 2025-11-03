<template>
  <button
    class="inline-flex items-center justify-center rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/10"
    :title="`Theme: ${mode}`"
    @click="toggle"
  >
    <component :is="icon" class="h-5 w-5" />
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'
import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'

const { mode, toggle } = useTheme()
const icon = computed(() => {
  if (mode.value === 'dark') return SunIcon
  if (mode.value === 'light') return MoonIcon
  return ComputerDesktopIcon
})
</script>
