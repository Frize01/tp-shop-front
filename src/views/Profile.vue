<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Card from 'primevue/card'
import Divider from 'primevue/divider'
import Avatar from 'primevue/avatar'
import Panel from 'primevue/panel'
import Button from 'primevue/button'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

const router = useRouter()
const authStore = useAuthStore()
const confirm = useConfirm()

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

// Génère les initiales pour l'avatar
const userInitials = computed(() => {
  if (!authStore.user || !authStore.user.name) return '?'

  const firstname = authStore.user.name.firstname || ''
  const lastname = authStore.user.name.lastname || ''

  return (firstname.charAt(0) + lastname.charAt(0)).toUpperCase()
})

// Fonction pour se déconnecter
const handleLogout = () => {
  confirm.require({
    message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      authStore.logout()
      router.push('/')
    },
    reject: () => {
      // Action en cas de rejet (facultatif)
    },
  })
}

// Fonction pour supprimer le compte
const handleDeleteAccount = () => {
  confirm.require({
    message:
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action supprimera également toutes vos commandes et votre panier actuel. Cette action est irréversible.',
    header: 'Attention',
    icon: 'pi pi-exclamation-circle',
    acceptClass: 'p-button-danger',
    acceptLabel: 'Supprimer',
    rejectLabel: 'Annuler',
    accept: async () => {
      const success = await authStore.deleteAccount()
      if (success) {
        router.push('/')
      }
    },
  })
}

// Fonction pour revenir à l'accueil
const goToHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Mon Profil</h1>

    <!-- Affichage du chargement -->
    <div v-if="authStore.loading" class="flex justify-center my-8">
      <ProgressSpinner />
    </div>

    <!-- Message d'erreur -->
    <Message v-if="authStore.error" severity="error" :closable="false" class="mb-4">
      {{ authStore.error }}
    </Message>

    <!-- Pas connecté -->
    <Message v-if="!authStore.isAuthenticated" severity="info" :closable="false" class="mb-4">
      Vous n'êtes pas connecté. Veuillez vous connecter pour accéder à votre profil.
    </Message>

    <!-- Contenu du profil -->
    <div
      v-if="authStore.isAuthenticated && userProfile"
      class="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <!-- Carte principale avec informations de base -->
      <Card class="md:col-span-1">
        <template #header>
          <div class="flex flex-col items-center justify-center p-4 bg-primary bg-opacity-10">
            <Avatar
              :label="userInitials"
              shape="circle"
              size="xlarge"
              class="mb-3 bg-primary text-white text-xl"
            />
            <h2 class="text-xl font-semibold">{{ userProfile.fullName }}</h2>
            <p class="text-gray-500">@{{ userProfile.username }}</p>
          </div>
        </template>
        <template #content>
          <div class="space-y-4">
            <div>
              <h3 class="font-medium text-gray-600 mb-1">Email</h3>
              <p>{{ userProfile.email }}</p>
            </div>
            <div>
              <h3 class="font-medium text-gray-600 mb-1">Téléphone</h3>
              <p>{{ userProfile.phone }}</p>
            </div>
            <Divider />
            <div class="flex flex-col space-y-2">
              <Button label="Déconnexion" severity="danger" outlined @click="handleLogout" />
              <Button
                label="Supprimer mon compte"
                severity="danger"
                text
                @click="handleDeleteAccount"
              />
              <Button label="Retour à l'accueil" text @click="goToHome" />
            </div>
          </div>
        </template>
      </Card>

      <!-- Informations détaillées -->
      <Card class="md:col-span-2">
        <template #title>
          <h2 class="text-xl font-semibold">Informations détaillées</h2>
        </template>
        <template #content>
          <Panel header="Informations personnelles" toggleable class="mb-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 class="font-medium text-gray-600 mb-1">Prénom</h3>
                <p>{{ authStore.user.name?.firstname || '-' }}</p>
              </div>
              <div>
                <h3 class="font-medium text-gray-600 mb-1">Nom</h3>
                <p>{{ authStore.user.name?.lastname || '-' }}</p>
              </div>
              <div>
                <h3 class="font-medium text-gray-600 mb-1">Nom d'utilisateur</h3>
                <p>{{ userProfile.username }}</p>
              </div>
            </div>
          </Panel>

          <Panel header="Adresse" toggleable class="mb-4" v-if="userProfile.address">
            <div class="grid grid-cols-1 gap-4">
              <div>
                <h3 class="font-medium text-gray-600 mb-1">Adresse complète</h3>
                <p>
                  {{ userProfile.address.number }} rue {{ userProfile.address.street }},
                  {{ userProfile.address.zipcode }} {{ userProfile.address.city }}
                </p>
              </div>
              <div>
                <h3 class="font-medium text-gray-600 mb-1">Email</h3>
                <p>{{ userProfile.email }}</p>
              </div>
            </div>
          </Panel>
        </template>
      </Card>
    </div>

    <!-- Dialogue de confirmation pour la déconnexion -->
    <ConfirmDialog />
  </div>
</template>

<style scoped>
.p-card-header {
  overflow: hidden;
}
</style>
