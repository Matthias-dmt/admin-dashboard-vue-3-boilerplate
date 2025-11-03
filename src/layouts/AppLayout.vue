<template>
  <div class="min-h-screen bg-[rgb(var(--bg))] text-[rgb(var(--text))]">
    <NavBar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    <Sidebar :open="sidebarOpen" @close="sidebarOpen = false" />
    <div :class="sidebarOpen ? 'pl-64' : ''">
      <main class="px-4 py-6 sm:px-6 lg:px-8">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/NavBar.vue'
import Sidebar from '@/components/Sidebar.vue'
import { ref } from 'vue'

const sidebarOpen = ref(false)
</script>
