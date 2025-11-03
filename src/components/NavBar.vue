<template>
  <header
    class="sticky top-0 z-30 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-black/10"
  >
    <div class="mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
      <button
        class="inline-flex items-center justify-center rounded-lg p-2 hover:bg-black/5 focus:outline-none"
        @click="$emit('toggle-sidebar')"
        aria-label="Toggle sidebar"
      >
        <Bars3Icon class="h-5 w-5" />
      </button>

      <RouterLink to="/" class="font-semibold tracking-tight"> Admin Dashboard </RouterLink>

      <div class="ml-auto flex items-center gap-2">
        <template v-if="auth.isAuthenticated">
          <Menu as="div" class="relative inline-block text-left">
            <MenuButton
              class="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-black/5"
            >
              <UserCircleIcon class="h-5 w-5" />
              <span class="text-sm">{{ auth.user?.email }}</span>
            </MenuButton>
            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-black/10 bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
              >
                <div class="p-1">
                  <MenuItem v-slot="{ active }">
                    <RouterLink
                      to="/"
                      :class="[
                        'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm',
                        active ? 'bg-black/5' : '',
                      ]"
                    >
                      <HomeIcon class="h-4 w-4" />
                      <span>Dashboard</span>
                    </RouterLink>
                  </MenuItem>

                  <MenuItem v-slot="{ active }">
                    <button
                      :class="[
                        'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600',
                        active ? 'bg-red-50' : '',
                      ]"
                      @click="onLogout"
                    >
                      <ArrowRightOnRectangleIcon class="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        </template>

        <template v-else>
          <RouterLink
            to="/login"
            class="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 bg-black text-white hover:bg-black/90"
          >
            <ArrowLeftOnRectangleIcon class="h-4 w-4" />
            <span class="text-sm">Sign in</span>
          </RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  HomeIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline'
import { Transition } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

async function onLogout() {
  await auth.logout()
  router.replace({ name: 'login' })
}
</script>
