<script setup>
import { defineProps } from 'vue'
import Divider from 'primevue/divider'

// Récupérer la variable d'environnement dans le script
const isDevelopment = import.meta.env.VITE_SERVER === 'develop'

const props = defineProps({
  // Données à afficher
  data: {
    type: [Object, Array],
    required: true,
  },
  // Titre de la section de débogage
  title: {
    type: String,
    default: 'Info de débogage',
  },
  // Si fermé par défaut
  defaultClosed: {
    type: Boolean,
    default: true,
  },
  // Hauteur maximale de la zone de texte
  maxHeight: {
    type: String,
    default: '6 0',
  },
})
</script>

<template>
  <div class="debug-data" v-if="isDevelopment">
    <Divider />
    <div class="text-xs text-gray-500 mt-2">
      <details :open="!defaultClosed">
        <summary class="pb-4">{{ title }}</summary>
        <pre
          class="text-xs overflow-auto p-2 bg-gray-100 rounded"
          :style="{ maxHeight: `${maxHeight}rem` }"
          >{{ JSON.stringify(data, null, 2) }}</pre
        >
      </details>
    </div>
  </div>
</template>

<style scoped>
.debug-data {
  margin-top: 1rem;
}
</style>
