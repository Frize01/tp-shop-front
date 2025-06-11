<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import ConfirmDialog from 'primevue/confirmdialog'
import Divider from 'primevue/divider'
import UserInfo from '@/components/profile/UserInfo.vue'
import UserAddress from '@/components/profile/UserAddress.vue'
import AccountActions from '@/components/profile/AccountActions.vue'

const router = useRouter()
const authStore = useAuthStore()

// Rediriger si l'utilisateur n'est pas connecté
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/auth')
  }
})

// Données formatées pour l'affichage
const userProfile = computed(() => {
  if (!authStore.user) return null

  return {
    fullName: authStore.userFullName,
    username: authStore.user.username,
    email: authStore.user.email,
    phone: authStore.user.phone,
    address: authStore.user.address
      ? {
          street: authStore.user.address.street || '',
          number: authStore.user.address.number || '',
          city: authStore.user.address.city || '',
          zipcode: authStore.user.address.zipcode || '',
          geolocation: authStore.user.address.geolocation
            ? {
                lat: authStore.user.address.geolocation.lat || '',
                long: authStore.user.address.geolocation.long || '',
              }
            : null,
        }
      : null,
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <ConfirmDialog />

    <!-- Affichage pendant le chargement -->
    <div v-if="!userProfile" class="flex justify-center items-center h-64">
      <ProgressSpinner />
    </div>

    <!-- Contenu du profil -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="md:col-span-3">
        <UserInfo :userProfile="userProfile" />
      </div>

      <div class="md:col-span-3">
        <UserAddress :address="userProfile.address" />
      </div>

      <div class="md:col-span-3">
        <Divider />
        <AccountActions />
      </div>
    </div>
  </div>
</template>
