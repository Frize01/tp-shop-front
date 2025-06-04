<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Bannière principale -->
    <Card class="mb-8 p-0 overflow-hidden">
      <template #content>
        <div class="relative">
          <img
            src="https://placehold.co/1200x400/5865F2/FFFFFF?text=ShopApp"
            alt="Bannière promotionnelle"
            class="w-full h-64 object-cover"
          />
          <div
            class="absolute inset-0 flex flex-col justify-center items-start p-8 bg-gradient-to-r from-black/50 to-transparent"
          >
            <h1 class="text-4xl font-bold text-white mb-4">Bienvenue sur ShopApp</h1>
            <p class="text-xl text-white mb-6">
              Découvrez nos produits exceptionnels à prix imbattables
            </p>
            <Button label="Découvrir" icon="pi pi-search" class="p-button-rounded" />
          </div>
        </div>
      </template>
    </Card>

    <!-- Catégories populaires -->
    <div class="mb-12">
      <h2 class="text-2xl font-semibold mb-6">Catégories populaires</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card
          v-for="(category, index) in categories"
          :key="index"
          class="transition-shadow hover:shadow-lg"
        >
          <template #header>
            <div class="h-40 bg-gray-200 relative">
              <img :src="category.image" :alt="category.name" class="w-full h-full object-cover" />
            </div>
          </template>
          <template #title>
            <h3 class="font-medium text-lg">{{ category.name }}</h3>
          </template>
          <template #content>
            <Badge :value="category.count + ' produits'" severity="info" />
          </template>
        </Card>
      </div>
    </div>

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
              <img
                :src="product.image"
                :alt="product.name"
                class="w-full h-48 object-cover"
              />
              <Tag
                v-if="product.discount"
                :value="'-' + product.discount + '%'"
                severity="danger"
                class="absolute top-2 right-2"
              />
            </div>
          </template>
          <template #title>
            <h3 class="font-medium">{{ product.name }}</h3>
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

    <!-- Inscription newsletter -->
    <Card class="bg-primary/10 p-0 mb-4">
      <template #content>
        <div class="p-4 text-center">
          <h2 class="text-2xl font-bold mb-2">Restez informé</h2>
          <p class="mb-6 text-gray-700">
            Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives
          </p>
          <div class="flex max-w-md mx-auto">
            <InputText
              placeholder="Votre adresse email"
              class="flex-1 p-inputtext-sm"
              type="email"
            />
            <Button label="S'inscrire" class="ml-2" />
          </div>
        </div>
      </template>
    </Card>
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

// Données des catégories
const categories = ref([
  {
    name: 'Électronique',
    count: 120,
    image: 'https://placehold.co/400x300/3498db/FFFFFF?text=Électronique',
  },
  {
    name: 'Vêtements',
    count: 85,
    image: 'https://placehold.co/400x300/e74c3c/FFFFFF?text=Vêtements',
  },
  { name: 'Maison', count: 73, image: 'https://placehold.co/400x300/2ecc71/FFFFFF?text=Maison' },
  { name: 'Sport', count: 41, image: 'https://placehold.co/400x300/f39c12/FFFFFF?text=Sport' },
])

// Données des produits en vedette
const featuredProducts = ref([
  {
    name: 'Smartphone XYZ Pro',
    price: 699.99,
    originalPrice: 799.99,
    discount: 12,
    rating: 4,
    reviews: 124,
    image: 'https://placehold.co/400x300/5865F2/FFFFFF?text=Smartphone',
  },
  {
    name: 'Écouteurs sans fil',
    price: 129.99,
    originalPrice: null,
    discount: null,
    rating: 5,
    reviews: 86,
    image: 'https://placehold.co/400x300/5865F2/FFFFFF?text=Écouteurs',
  },
  {
    name: 'Montre connectée',
    price: 199.99,
    originalPrice: 249.99,
    discount: 20,
    rating: 4,
    reviews: 63,
    image: 'https://placehold.co/400x300/5865F2/FFFFFF?text=Montre',
  },
  {
    name: 'Laptop Ultra',
    price: 1299.99,
    originalPrice: null,
    discount: null,
    rating: 5,
    reviews: 42,
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

<style scoped>
.text-primary {
  color: var(--primary-color, #5865f2);
}

.bg-primary {
  background-color: var(--primary-color, #5865f2);
}

.bg-primary\/10 {
  background-color: rgba(var(--primary-color-rgb, 88, 101, 242), 0.1);
}

.bg-primary\/20 {
  background-color: rgba(var(--primary-color-rgb, 88, 101, 242), 0.2);
}

.hover\:bg-primary\/90:hover {
  background-color: rgba(var(--primary-color-rgb, 88, 101, 242), 0.9);
}

.focus\:ring-primary\/50:focus {
  --tw-ring-color: rgba(var(--primary-color-rgb, 88, 101, 242), 0.5);
}
</style>
