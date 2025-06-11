<script setup>
import { ref, computed, watch } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import OrdersTable from '@/components/orders/OrdersTable.vue'
import OrderDetails from '@/components/orders/OrderDetails.vue'

const ordersStore = useOrdersStore()
const authStore = useAuthStore()

const selectedOrder = ref(null)
const displayOrderDetails = ref(false)

// Surveiller les changements de l'état de la modale
watch(
  () => displayOrderDetails.value,
  (newValue) => {
    console.log(`Orders.vue: La visibilité de la modale a changé à ${newValue}`)
  },
  { immediate: true },
)

// Valeur par défaut pour éviter les erreurs lorsque selectedOrder est null
const safeSelectedOrder = computed(() => {
  if (!selectedOrder.value)
    return {
      id: '',
      date: new Date().toISOString(),
      status: 'processing',
      products: [],
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
    }

  // Cloner pour éviter de modifier l'original
  return { ...selectedOrder.value }
})

// Afficher les détails d'une commande
function showOrderDetails(order) {
  console.log('Ouverture des détails de la commande:', order)
  selectedOrder.value = order

  // Légère temporisation pour s'assurer que le DOM est mis à jour
  setTimeout(() => {
    displayOrderDetails.value = true
    console.log('État après mise à jour:', {
      displayOrderDetails: displayOrderDetails.value,
      selectedOrder: selectedOrder.value,
    })
  }, 10)
}

// Fermer la modale des détails de commande
function closeOrderDetails() {
  console.log('Fermeture des détails de la commande')
  displayOrderDetails.value = false
  // Reset de la commande sélectionnée après un court délai pour permettre
  // à l'animation de fermeture de se terminer avant de réinitialiser les données
  setTimeout(() => {
    selectedOrder.value = null
  }, 300)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- En-tête de la page -->
    <div class="mb-8">
      <h1 class="text-3xl font-semibold mb-2">Vos commandes</h1>
      <p class="text-gray-600">Historique et suivi de toutes vos commandes</p>
    </div>

    <!-- Tableau des commandes -->
    <div v-if="ordersStore.userOrders.length > 0">
      <OrdersTable :orders="ordersStore.userOrders" @view-details="showOrderDetails" />
    </div>

    <!-- Message si aucune commande -->
    <div v-else class="text-center py-8">
      <i class="pi pi-shopping-bag text-5xl text-gray-300 mb-4"></i>
      <p class="text-xl font-medium text-gray-600 mb-2">Vous n'avez pas encore de commande</p>
      <p class="text-gray-500 mb-4">Explorez notre catalogue et effectuez votre premier achat</p>
      <div class="flex justify-center gap-4 flex-wrap">
        <router-link to="/" class="p-button p-component">
          <span class="p-button-label">Voir les produits</span>
        </router-link>
      </div>
    </div>

    <!-- Modal de détails de commande -->
    <OrderDetails v-model:visible="displayOrderDetails" :order="safeSelectedOrder" />
  </div>
</template>
