<script setup>
import { ref, computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Tag from 'primevue/tag'

const props = defineProps({
  orders: {
    type: Array,
    required: true,
  },
})

// Optimisation pour éviter les re-rendus inutiles
const processedOrders = computed(() => {
  return props.orders.map((order) => ({
    ...order,
    formattedDate: formatDate(order.date),
    statusSeverity: getOrderStatusSeverity(order.status),
    statusLabel: getOrderStatusLabel(order.status),
    formattedTotal: `${order.total.toFixed(2)} €`,
  }))
})

const emit = defineEmits(['view-details'])

// Afficher les détails d'une commande
function showOrderDetails(order) {
  console.log("OrdersTable: Émission de l'événement view-details avec la commande:", order)
  emit('view-details', order)
}

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

// Status de la commande avec couleur
function getOrderStatusSeverity(status) {
  switch (status) {
    case 'completed':
      return 'success'
    case 'processing':
      return 'info'
    case 'shipped':
      return 'warning'
    case 'cancelled':
      return 'danger'
    default:
      return 'secondary'
  }
}

function getOrderStatusLabel(status) {
  switch (status) {
    case 'completed':
      return 'Terminée'
    case 'processing':
      return 'En traitement'
    case 'shipped':
      return 'Expédiée'
    case 'cancelled':
      return 'Annulée'
    default:
      return status
  }
}
</script>

<template>
  <DataTable
    :value="processedOrders"
    tableStyle="min-width: 50rem"
    stripedRows
    paginator
    :rows="5"
    :rowsPerPageOptions="[5, 10, 20]"
    class="p-datatable-sm"
  >
    <Column field="id" header="N° Commande" style="width: 120px">
      <template #body="{ data }"> #{{ data.id }} </template>
    </Column>

    <Column field="formattedDate" header="Date" style="width: 180px" />

    <Column field="status" header="Statut" style="width: 150px">
      <template #body="{ data }">
        <Tag :value="data.statusLabel" :severity="data.statusSeverity" />
      </template>
    </Column>

    <Column field="formattedTotal" header="Montant" style="width: 120px" />

    <Column header="Actions" style="width: 100px">
      <template #body="{ data }">
        <Button
          icon="pi pi-eye"
          text
          rounded
          aria-label="Voir les détails"
          @click="showOrderDetails(data)"
        />
      </template>
    </Column>
  </DataTable>
</template>
