import { config } from '@vue/test-utils'

// Render-only RouterLink stub that exposes slot props
config.global.stubs = {
  RouterLink: {
    name: 'RouterLink',
    props: ['to', 'custom'],
    setup(_props, { slots }) {
      return () =>
        slots.default?.({
          href: '/',
          navigate: () => {},
          isActive: false,
          isExactActive: false,
        }) ?? null
    },
  },
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
})
