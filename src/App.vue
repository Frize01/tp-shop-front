<script setup>
import { RouterLink, RouterView } from 'vue-router'
import useEruda from './composables/eruda'
import Btn from 'primevue/button'
import Navigation from './components/layout/navigation.vue'
useEruda()
</script>

<template>
  <Navigation />
  <div class="p-4">
    <RouterView />
  </div>
</template>
