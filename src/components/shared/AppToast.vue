<template>
  <Toast position="top-right" :group="toastGroup" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'
import toastService, { ToastTypes } from '@/services/toast'

const toast = useToast()
const toastGroup = ref('app-toast')

// Fonction pour convertir les notifications du service en notifications PrimeVue
function showToast(notification) {
  toast.add({
    severity: notification.severity,
    summary: notification.summary,
    detail: notification.detail,
    life: notification.life,
    group: toastGroup.value,
  })
}

// Observer les changements dans le service de toast
let interval
onMounted(() => {
  // Vérifier périodiquement les nouvelles notifications
  let lastCount = 0

  interval = setInterval(() => {
    const toasts = toastService.getToasts()
    if (toasts.length > lastCount) {
      // Afficher seulement les nouvelles notifications
      toasts.slice(lastCount).forEach((notification) => {
        showToast(notification)
        toastService.remove(notification.id)
      })
    }
    lastCount = toasts.length
  }, 100)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>

<style scoped>
/* Styles pour les toasts si nécessaire */
</style>
