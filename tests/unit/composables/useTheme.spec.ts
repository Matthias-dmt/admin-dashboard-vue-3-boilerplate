import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'
import { useTheme } from '@/composables/useTheme'

function hasDarkClass() {
  return (
    document.documentElement.classList.contains('dark') || document.body.classList.contains('dark')
  )
}

function lastSetItemCall() {
  const calls = (localStorage.setItem as unknown as vi.Mock).mock.calls
  return calls[calls.length - 1] as [string, string] | undefined
}

describe('useTheme (reactive)', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    document.body.classList.remove('dark')
    vi.restoreAllMocks()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {})
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null)
  })

  it('sets dark mode and persists', async () => {
    const { setDark } = useTheme()
    setDark()
    await nextTick() // wait for watcher flush

    expect(hasDarkClass()).toBe(true)
    expect(localStorage.setItem).toHaveBeenCalled()
    const last = lastSetItemCall()
    expect(last?.[1]).toBe('dark')
  })

  it('sets light mode and persists', async () => {
    const { setDark, setLight } = useTheme()
    setDark()
    await nextTick()
    setLight()
    await nextTick()

    expect(hasDarkClass()).toBe(false)
    expect(localStorage.setItem).toHaveBeenCalled()
    const last = lastSetItemCall()
    expect(last?.[1]).toBe('light')
  })

  it('toggle switches between light/dark', async () => {
    const { toggle } = useTheme()
    toggle()
    await nextTick()
    expect(hasDarkClass()).toBe(true)

    toggle()
    await nextTick()
    expect(hasDarkClass()).toBe(false)
  })
})
