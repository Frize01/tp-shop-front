<script setup>
import { ref, onMounted } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import { apiService } from '@/config/api'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'primevue/usetoast'

// Store du panier
const cartStore = useCartStore()
let toast

onMounted(() => {
  toast = useToast()
})

// Fonction pour ajouter un produit au panier
const addToCart = (product) => {
  cartStore.addItem(product)
  if (toast) {
    toast.add({
      severity: 'success',
      summary: 'Produit ajouté',
      detail: `${product.title} a été ajouté au panier`,
      life: 3000,
    })
  }
}

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
</script>

<template>
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
            <Button
              icon="pi pi-shopping-cart"
              rounded
              text
              aria-label="Ajouter au panier"
              @click="addToCart(product)"
            />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
