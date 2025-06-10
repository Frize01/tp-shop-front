<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Button from 'primevue/button'
import { useConfirm } from 'primevue/useconfirm'

const router = useRouter()
const authStore = useAuthStore()
const confirm = useConfirm()

// Méthode pour la déconnexion
const logout = () => {
  confirm.require({
    message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Oui',
    rejectLabel: 'Non',
    accept: () => {
      authStore.logout()
      router.push('/auth')
    },
  })
}

// Méthode pour la suppression du compte
const deleteAccount = () => {
  confirm.require({
    message: 'Cette action est irréversible. Êtes-vous sûr de vouloir supprimer votre compte ?',
    header: 'Attention',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    acceptLabel: 'Oui, supprimer',
    rejectLabel: 'Annuler',
    accept: async () => {
      try {
        await authStore.deleteAccount()
        router.push('/auth')
      } catch (error) {
        console.error('Erreur lors de la suppression du compte :', error)
      }
    },
  })
}
</script>

<template>
  <div class="flex flex-col md:flex-row gap-4 mt-6">
    <Button
      label="Se déconnecter"
      icon="pi pi-sign-out"
      severity="secondary"
      @click="logout"
      class="flex-1"
    />
    <Button
      label="Supprimer le compte"
      icon="pi pi-trash"
      severity="danger"
      @click="deleteAccount"
      class="flex-1"
    />
  </div>
</template>
