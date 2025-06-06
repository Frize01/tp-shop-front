<script setup>
import { ref } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import Divider from 'primevue/divider'

const ordersStore = useOrdersStore()
const authStore = useAuthStore()

const selectedOrder = ref(null)
const displayOrderDetails = ref(false)

// Formatage de la date
function formatDate(date) {
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Afficher les détails d'une commande
function showOrderDetails(order) {
  selectedOrder.value = order
  displayOrderDetails.value = true
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
      <DataTable
        :value="ordersStore.userOrders"
        tableStyle="min-width: 50rem"
        stripedRows
        paginator
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20]"
      >
        <Column field="id" header="N° de commande" sortable>
          <template #body="{ data }">
            <span class="font-bold">{{ data.id }}</span>
          </template>
        </Column>
        <Column field="userId" header="Client" sortable>
          <template #body="{ data }">
            {{ authStore.userFullName || 'Vous' }}
          </template>
        </Column>
        <Column field="date" header="Date" sortable>
          <template #body="{ data }">
            {{ formatDate(data.date) }}
          </template>
        </Column>
        <Column field="items" header="Articles">
          <template #body="{ data }"> {{ data.items.length }} article(s) </template>
        </Column>
        <Column field="total" header="Total" sortable>
          <template #body="{ data }">
            <span class="font-bold">{{ data.total.toFixed(2) }} €</span>
          </template>
        </Column>
        <Column field="status" header="Statut">
          <template #body="{ data }">
            <Tag
              :severity="data.status === 'validée' ? 'success' : 'warning'"
              :value="data.status"
            />
          </template>
        </Column>
        <Column header="Actions">
          <template #body="{ data }">
            <Button
              icon="pi pi-eye"
              text
              rounded
              aria-label="Voir détails"
              @click="showOrderDetails(data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Message si aucune commande -->
    <div v-else class="text-center py-12">
      <i class="pi pi-shopping-bag text-5xl text-gray-300"></i>
      <h3 class="text-xl mt-4">Vous n'avez pas encore passé de commande</h3>
      <p class="text-gray-500 mt-2">Explorez notre boutique et passez votre première commande !</p>
      <Button label="Découvrir nos produits" icon="pi pi-shopping-cart" class="mt-4" to="/" />
    </div>

    <!-- Modal de détails de commande -->
    <Dialog
      v-model:visible="displayOrderDetails"
      modal
      header="Détails de la commande"
      :style="{ width: '90vw', maxWidth: '650px' }"
      :dismissableMask="true"
    >
      <div v-if="selectedOrder" class="p-2">
        <div class="flex justify-between mb-4">
          <div>
            <h3 class="font-bold text-lg">Commande #{{ selectedOrder.id }}</h3>
            <p class="text-gray-600">Passée le {{ formatDate(selectedOrder.date) }}</p>
            <p class="text-gray-600">Client: {{ authStore.userFullName || 'Vous' }}</p>
          </div>
          <Tag
            :severity="selectedOrder.status === 'validée' ? 'success' : 'warning'"
            :value="selectedOrder.status"
          />
        </div>

        <Divider />

        <!-- Articles de la commande -->
        <div class="my-4">
          <h4 class="font-semibold mb-3">Articles commandés</h4>
          <ul class="space-y-4">
            <li
              v-for="(item, index) in selectedOrder.items"
              :key="index"
              class="flex gap-3 border-b pb-3"
            >
              <img :src="item.image" :alt="item.title" class="w-16 h-16 object-cover rounded" />
              <div class="flex-1">
                <div class="font-medium">{{ item.title }}</div>
                <div class="text-sm text-gray-600">
                  Quantité: {{ item.quantity }} ×
                  <span class="font-semibold">{{ item.price.toFixed(2) }} €</span>
                </div>
              </div>
              <div class="text-right font-semibold">
                {{ (item.price * item.quantity).toFixed(2) }} €
              </div>
            </li>
          </ul>
        </div>

        <!-- Résumé du paiement -->
        <div class="bg-gray-50 p-4 rounded-lg mt-6">
          <div class="flex justify-between mb-2">
            <span>Sous-total</span>
            <span>{{ selectedOrder.subtotal.toFixed(2) }} €</span>
          </div>
          <div class="flex justify-between mb-2">
            <div class="flex items-center">
              <span>Frais de livraison</span>
              <span
                v-if="selectedOrder.shipping === 0"
                class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full"
              >
                Gratuit
              </span>
            </div>
            <span>{{ selectedOrder.shipping.toFixed(2) }} €</span>
          </div>
          <Divider />
          <div class="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{{ selectedOrder.total.toFixed(2) }} €</span>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
.p-datatable :deep(th) {
  @apply bg-gray-100;
}

.p-datatable :deep(.p-paginator) {
  @apply mt-4;
}
</style>
