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
          <InputText placeholder="Rechercher un produit" type="text" class="w-32 sm:w-auto" />
        </div>
      </template>
    </Menubar>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Menubar from 'primevue/menubar'
import { InputText } from 'primevue'

const router = useRouter()

const items = ref([
  {
    label: 'Boutique',
    icon: 'pi pi-shopping-cart',
    items: [
      {
        label: 'Produits',
        route: '/',
      },
      {
        label: 'Catégories',
        route: '/',
      },
    ],
  },
  {
    label: 'Mon Compte',
    icon: 'pi pi-user',
    command: () => {
      router.push('/vite')
    },
  },
])
</script>
