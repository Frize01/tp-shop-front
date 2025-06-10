<template>
  <div class="card">
    <Menubar :model="items">
      <template #item="{ item, props, hasSubmenu }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span>{{ item.label }}</span>
          </a>
        </router-link>
        <a v-else v-ripple :href="item.url" :target="item.target" v-bind="props.action">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down" />
        </a>
      </template>
      <template #end>
        <div class="flex items-center gap-2">
          <!-- <InputText placeholder="Rechercher un produit" type="text" class="w-32 sm:w-auto" /> -->
          <CartIcon @showCart="cartSidebarVisible = true" />
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-2">
            <Button
              icon="pi pi-sign-out"
              text
              rounded
              aria-label="Déconnexion"
              @click="authStore.logout()"
            />
          </div>
        </div>
      </template>
    </Menubar>

    <!-- Sidebar du panier -->
    <CartSidebar :visible="cartSidebarVisible" @update:visible="cartSidebarVisible = $event" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Menubar from 'primevue/menubar'
import { InputText } from 'primevue'
import { useAuthStore } from '@/stores/auth'
import Button from 'primevue/button'
import CartIcon from '@/components/cart/CartIcon.vue'
import CartSidebar from '@/components/cart/CartSidebar.vue'

const router = useRouter()
const authStore = useAuthStore()
const cartSidebarVisible = ref(false)

// Utilisez un computed pour mettre à jour les éléments du menu en fonction de l'état d'authentification
const items = computed(() => {
  const menuItems = [
    {
      label: 'Boutique',
      icon: 'pi pi-shopping-cart',
      route: '/',
    },
  ]

  // Si l'utilisateur est connecté, afficher le menu Mon Compte
  if (authStore.isAuthenticated) {
    menuItems.push({
      label: 'Mon Compte',
      icon: 'pi pi-user',
      items: [
        {
          label: 'Profil',
          icon: 'pi pi-id-card',
          command: () => {
            router.push('/profile')
          },
        },
        {
          label: 'Commandes',
          icon: 'pi pi-list',
          command: () => {
            router.push('/orders')
          },
        },
        {
          label: 'Déconnexion',
          icon: 'pi pi-sign-out',
          command: () => {
            authStore.logout()
            router.push('/')
          },
        },
      ],
    })
  } else {
    // Si l'utilisateur n'est pas connecté, afficher le lien vers la page d'authentification
    menuItems.push({
      label: 'Connexion / Inscription',
      icon: 'pi pi-sign-in',
      command: () => {
        router.push('/auth')
      },
    })
  }

  return menuItems
})
</script>
