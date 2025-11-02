<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-semibold tracking-tight">Dashboard</h1>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div class="rounded-xl border border-black/10 bg-white p-4 shadow-sm">
        <p class="text-sm text-gray-600">Welcome</p>
        <p class="mt-1 font-medium">{{ auth.user?.firstName }} {{ auth.user?.lastName }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>
