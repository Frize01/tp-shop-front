<script setup>
import { RouterLink, RouterView } from 'vue-router'
import useEruda from './composables/eruda'
import Btn from 'primevue/button'
useEruda()
</script>

<template>
  <Btn label="Bonjour" />
</template>
