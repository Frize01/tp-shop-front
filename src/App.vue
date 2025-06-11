<script setup>
import { RouterView } from 'vue-router'
import useEruda from './composables/eruda'
import NavigationBar from './components/layout/NavigationBar.vue'
import FooterBar from './components/layout/FooterBar.vue'
import AppToast from './components/shared/AppToast.vue'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

// Initialiser l'outil de débogage
useEruda()

// Initialiser l'authentification au démarrage de l'application
const authStore = useAuthStore()
onMounted(() => {
  authStore.initAuth()
})
</script>

<template>
  <NavigationBar />
  <div class="p-4 flex-1">
    <RouterView />
  </div>
  <FooterBar />
  <AppToast />
</template>
