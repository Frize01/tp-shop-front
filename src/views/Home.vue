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
            <div class="flex items-center mt-1">
              <Rating :modelValue="product.rating" :readonly="true" :cancel="false" />
              <span class="text-xs text-gray-500 ml-1">({{ product.reviews }})</span>
            </div>
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

<script setup>
import { ref } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import Rating from 'primevue/rating'
import Tag from 'primevue/tag'
import Avatar from 'primevue/avatar'
import InputText from 'primevue/inputtext'

// Données des produits en vedette
const featuredProducts = ref([
  {
    id: 1,
    title: 'Smartphone XYZ Pro',
    price: 699.99,
    originalPrice: 799.99,
    discount: 12,
    rating: 4,
    reviews: 124,
    category: 'Électronique',
    description:
      'Le smartphone le plus puissant de notre gamme avec un écran AMOLED 6.7", processeur octa-core et appareil photo 108MP.',
    image: 'https://placehold.co/400x300/5865F2/FFFFFF?text=Smartphone',
  },
  {
    id: 2,
    title: 'Écouteurs sans fil',
    price: 129.99,
    originalPrice: null,
    discount: null,
    rating: 5,
    reviews: 86,
    category: 'Électronique',
    description:
      'Écouteurs sans fil à réduction de bruit active, autonomie de 30 heures et son immersif de haute qualité.',
    image: 'https://placehold.co/400x300/5865F2/FFFFFF?text=Écouteurs',
  },
  {
    id: 3,
    title: 'Montre connectée',
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    rating: 4,
    reviews: 63,
    category: 'Électronique',
    description:
      'Montre intelligente avec suivi de la santé, notifications, GPS intégré et autonomie de 7 jours.',
    image: 'https://placehold.co/400x300/5865F2/FFFFFF?text=Montre',
  },
  {
    id: 4,
    title: 'Laptop Ultra',
    price: 1299.99,
    originalPrice: null,
    discount: null,
    rating: 5,
    reviews: 42,
    category: 'Informatique',
    description:
      'Ordinateur portable ultraléger avec processeur dernière génération, 16GB RAM, 512GB SSD et écran haute résolution.',
    image: 'https://placehold.co/400x300/5865F2/FFFFFF?text=Laptop',
  },
])

// Avantages client
const features = ref([
  {
    title: 'Livraison gratuite',
    description: 'Livraison gratuite pour toute commande supérieure à 50€',
    icon: 'pi pi-truck',
  },
  {
    title: 'Paiement sécurisé',
    description: 'Vos paiements sont 100% sécurisés',
    icon: 'pi pi-lock',
  },
  {
    title: 'Assistance 24/7',
    description: 'Notre équipe est disponible 24h/24 et 7j/7',
    icon: 'pi pi-comments',
  },
])
</script>

<style scoped></style>
