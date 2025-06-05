<script setup>
import { RouterView } from 'vue-router'
import useEruda from './composables/eruda'
import Navigation from './components/layout/Navigation.vue'
import Footer from './components/layout/Footer.vue'
useEruda()
</script>

<template>
  <Navigation />
  <div class="p-4 flex-1">
    <RouterView />
  </div>
  <Footer />
</template>
