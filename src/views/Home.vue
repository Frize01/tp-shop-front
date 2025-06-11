<script setup>
import Toast from 'primevue/toast'
import FeaturedProducts from '@/components/home/FeaturedProducts.vue'
import Features from '@/components/home/Features.vue'
</script>

<template>
  <Toast position="top-right" />

  <!-- Produits en vedette -->
  <div class="container mx-auto px-4 py-8">
    <FeaturedProducts />
  </div>

  <!-- Avantages (pas dans le container pour permettre un fond pleine largeur) -->
  <Features />
</template>
