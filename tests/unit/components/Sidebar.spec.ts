import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Sidebar from '@/components/Sidebar.vue'

describe('Sidebar', () => {
  it('emits close when clicking outside', async () => {
    const wrapper = mount(Sidebar, {
      props: { open: true },
      attachTo: document.body,
    })

    await wrapper.vm.$nextTick()
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('emits close when clicking a link (custom RouterLink stub)', async () => {
    const wrapper = mount(Sidebar, {
      props: { open: true },
      attachTo: document.body,
    })

    // Click the first anchor inside the sidebar
    const a = wrapper.find('a')
    await a.trigger('click', { preventDefault: () => {} })

    expect(wrapper.emitted('close')).toBeTruthy()
  })
})
