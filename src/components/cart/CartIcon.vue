<script setup>
import { useCartStore } from '@/stores/cart'
import Badge from 'primevue/badge'
import Button from 'primevue/button'

const cartStore = useCartStore()
</script>

<template>
  <div class="relative">
    <Button
      icon="pi pi-shopping-cart"
      text
      rounded
      aria-label="Panier"
      class="p-button-text"
      @click="$emit('showCart')"
    />
    <Badge
      v-if="cartStore.count > 0"
      :value="cartStore.count"
      severity="danger"
      class="absolute -top-1 -right-1"
    />
  </div>
</template>
