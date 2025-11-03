import { computed, onMounted, ref, watch } from 'vue'

type ThemeMode = 'light' | 'dark' | 'system'
const THEME_KEY = 'ui.theme'

const stored = ((): ThemeMode | null => {
  try {
    const v = localStorage.getItem(THEME_KEY)
    return v === 'light' || v === 'dark' || v === 'system' ? v : null
  } catch {
    return null
  }
})()

const mode = ref<ThemeMode>(stored ?? 'light') // choose 'light' default for tests
const media = window.matchMedia?.('(prefers-color-scheme: dark)')
const systemPrefersDark = () => !!media && media.matches

const isDark = computed<boolean>(() => {
  return mode.value === 'dark' || (mode.value === 'system' && systemPrefersDark())
})

function apply() {
  const el = document.documentElement
  if (isDark.value) el.classList.add('dark')
  else el.classList.remove('dark')
}

function persist() {
  try {
    localStorage.setItem(THEME_KEY, mode.value)
  } catch {}
}

function setDark() {
  mode.value = 'dark'
}
function setLight() {
  mode.value = 'light'
}
function setSystem() {
  mode.value = 'system'
}

function toggle() {
  // toggle only between light/dark for UX; ignore 'system'
  mode.value = isDark.value ? 'light' : 'dark'
}

onMounted(() => {
  apply()
  media?.addEventListener?.('change', apply)
})

watch(
  mode,
  () => {
    apply()
    persist()
  },
  { immediate: true },
)

export function useTheme() {
  return {
    mode,
    isDark,
    setDark,
    setLight,
    setSystem,
    toggle,
  }
}
