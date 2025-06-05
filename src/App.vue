<script setup>
import { RouterView } from 'vue-router'
import useEruda from './composables/eruda'
import NavigationBar from './components/layout/NavigationBar.vue'
import FooterBar from './components/layout/FooterBar.vue'
useEruda()
</script>

<template>
  <NavigationBar />
  <div class="p-4 flex-1">
    <RouterView />
  </div>
  <FooterBar />
</template>
