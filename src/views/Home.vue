<script setup>
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import { apiService } from '@/config/api'

// Données des produits en vedette
const featuredProducts = ref([])

apiService
  .get('/products')
  .then((response) => {
    featuredProducts.value = response.data
    console.log('Produits récupérés avec succès:', featuredProducts.value)
  })
  .catch((error) => {
    console.error('Erreur lors de la récupération des produits:', error)
  })

// Avantages client
const features = ref([
  {
    title: 'Livraison gratuite',
    description: 'Livraison gratuite pour toute commande supérieure à 50€',
    icon: 'pi pi-truck',
  },
  {
    title: 'Paiement sécurisé',
    description: 'Vos paiements sont 100% pas sécurisés',
    icon: 'pi pi-lock',
  },
  {
    title: 'Assistance 24/7',
    description: 'Notre équipe est indisponible 24h/24 et 7j/7',
    icon: 'pi pi-comments',
  },
])
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Produits en vedette -->
    <div class="mb-12">
      <h2 class="text-2xl font-semibold mb-6">Produits en vedette</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          v-for="(product, index) in featuredProducts"
          :key="index"
          class="h-full transition-shadow hover:shadow-lg"
        >
          <template #header>
            <div class="relative">
              <img :src="product.image" :alt="product.title" class="w-full h-48 object-cover" />
              <Tag
                v-if="product.discount"
                :value="'-' + product.discount + '%'"
                severity="danger"
                class="absolute top-2 right-2"
              />
            </div>
          </template>
          <template #title>
            <h3 class="font-medium">{{ product.title }}</h3>
          </template>
          <template #content>
            <div class="mt-2 flex items-center justify-between">
              <div>
                <span v-if="product.discount" class="text-gray-500 line-through text-sm">
                  {{ product.originalPrice }} €
                </span>
                <span class="text-lg font-bold text-primary ml-1">{{ product.price }} €</span>
              </div>
              <Button icon="pi pi-shopping-cart" rounded text aria-label="Ajouter au panier" />
            </div>
          </template>
        </Card>
      </div>
    </div>

    <!-- Avantages -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <Card v-for="(feature, index) in features" :key="index" class="flex flex-row">
        <template #content>
          <div class="flex items-start">
            <Avatar :icon="feature.icon" class="mr-4" size="large" shape="circle" />
            <div>
              <h3 class="font-semibold text-lg mb-2">{{ feature.title }}</h3>
              <p class="text-gray-600">{{ feature.description }}</p>
            </div>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
