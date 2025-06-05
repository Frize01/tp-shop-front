<template>
  <footer class="surface-section px-4 py-3 border-top-1 surface-border">
    <div class="flex justify-content-between align-items-center">
      <span class="text-600 text-sm">
        &copy; {{ currentYear }} Pas Swann. Tous droits pas réservés.
      </span>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
