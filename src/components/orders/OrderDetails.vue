<script setup>
import { defineProps, defineEmits, computed, ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import Tag from 'primevue/tag'
import ProgressBar from 'primevue/progressbar'
import Button from 'primevue/button'
import { useOrdersStore } from '@/stores/orders'
import toastService from '@/services/toast'

const ordersStore = useOrdersStore()

const props = defineProps({
  order: {
    type: Object,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:visible'])

// Créer une variable locale pour contrôler la visibilité du Dialog
const dialogVisible = ref(false)

// Synchroniser la prop visible avec notre état local
watch(
  () => props.visible,
  (newValue) => {
    dialogVisible.value = newValue
  },
)

// Surveiller les changements de dialogVisible et émettre l'événement update:visible
watch(dialogVisible, (newValue) => {
  if (newValue !== props.visible) {
    emit('update:visible', newValue)
  }
})

// Fermer la modal
function closeDialog() {
  console.log('Fermeture de la modale de détails de commande')
  dialogVisible.value = false // Utiliser notre variable locale
}

// Cette fonction est appelée quand la modale est cachée
function onDialogHide() {
  closeDialog()
}

const safeOrder = computed(() => {
  // Garantir que chaque propriété existe pour éviter les erreurs
  if (!props.order)
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

  return {
    ...props.order,
    products: props.order.products || props.order.items || [],
    subtotal: props.order.subtotal !== undefined ? props.order.subtotal : 0,
    shipping: props.order.shipping !== undefined ? props.order.shipping : 0,
    tax: props.order.tax !== undefined ? props.order.tax : (props.order.subtotal || 0) * 0.2,
    total: props.order.total !== undefined ? props.order.total : 0,
  }
})

// Valeur de progression selon le statut de la commande
const orderProgress = computed(() => {
  switch (safeOrder.value.status) {
    case 'processing':
      return 25
    case 'shipped':
      return 60
    case 'completed':
      return 100
    case 'cancelled':
      return 0
    default:
      return 0
  }
})

// Style de la barre de progression selon le statut
const progressBarStyle = computed(() => {
  if (safeOrder.value.status === 'cancelled') {
    return {
      background: 'var(--red-500)',
      height: '0.5rem',
    }
  }
  return { height: '0.5rem' }
})

// Classes CSS pour les étapes du statut
const getStepClass = (stepStatus) => {
  const statusOrder = ['processing', 'shipped', 'completed']
  const currentIndex = statusOrder.indexOf(safeOrder.value.status)
  const stepIndex = statusOrder.indexOf(stepStatus)

  if (safeOrder.value.status === 'cancelled') {
    return 'text-red-500 font-normal'
  }

  if (stepIndex <= currentIndex) {
    return 'text-primary font-bold'
  }

  return 'text-gray-400 font-normal'
}

// Formater la date
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

// Mettre à jour le statut d'une commande
function updateStatus(newStatus) {
  if (ordersStore.updateOrderStatus(safeOrder.value.id, newStatus)) {
    toastService.success(`Statut de la commande mis à jour : ${getOrderStatusLabel(newStatus)}`)

    // Si la commande est annulée, fermer la modale après un court délai
    if (newStatus === 'cancelled') {
      setTimeout(() => {
        closeDialog()
      }, 1500)
    }
  } else {
    toastService.error('Erreur lors de la mise à jour du statut')
  }
}

// Vérifier si l'utilisateur peut annuler la commande
const canCancel = computed(() => {
  return safeOrder.value.status === 'processing'
})
</script>

<template>
  <Dialog
    :visible="dialogVisible"
    @update:visible="dialogVisible = $event"
    modal
    header="Détails de la commande"
    :style="{ width: '90vw', maxWidth: '550px' }"
    :draggable="false"
    :closable="true"
    @hide="onDialogHide"
    position="top"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :showHeader="true"
  >
    <div class="p-2">
      <!-- En-tête de la commande -->
      <div class="flex justify-between items-center mb-4">
        <div>
          <h3 class="text-xl font-semibold">Commande #{{ safeOrder.id }}</h3>
          <p class="text-sm text-gray-600">{{ formatDate(safeOrder.date) }}</p>
        </div>
        <Tag
          :value="getOrderStatusLabel(safeOrder.status)"
          :severity="getOrderStatusSeverity(safeOrder.status)"
          size="large"
        />
      </div>

      <!-- Barre de progression du statut -->
      <div class="mb-4" v-if="safeOrder.status !== 'cancelled'">
        <ProgressBar :value="orderProgress" :style="progressBarStyle" />
        <div class="flex justify-between mt-2">
          <span :class="getStepClass('processing')">En traitement</span>
          <span :class="getStepClass('shipped')">Expédiée</span>
          <span :class="getStepClass('completed')">Livrée</span>
        </div>
      </div>

      <!-- Message si commande annulée -->
      <div
        class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
        v-if="safeOrder.status === 'cancelled'"
      >
        <p class="text-red-500 font-medium">Cette commande a été annulée.</p>
      </div>

      <Divider />

      <!-- Produits de la commande -->
      <div class="mb-4">
        <h4 class="font-medium mb-3">Articles</h4>
        <div
          v-for="(item, index) in safeOrder.products"
          :key="index"
          class="flex justify-between items-center mb-2 p-2 border-bottom-1 border-300"
        >
          <div class="flex items-center">
            <div class="mr-3 font-medium">{{ item.quantity || 1 }}x</div>
            <div>
              <div class="font-medium">{{ item.product ? item.product.title : 'Produit' }}</div>
              <div class="text-sm text-gray-600">
                {{ item.product ? (item.product.price || 0).toFixed(2) : '0.00' }} €
              </div>
            </div>
          </div>
          <div class="font-medium">
            {{
              item.product ? ((item.quantity || 1) * (item.product.price || 0)).toFixed(2) : '0.00'
            }}
            €
          </div>
        </div>
      </div>

      <Divider />

      <!-- Récapitulatif des prix -->
      <div class="mb-4">
        <h4 class="font-medium mb-3">Récapitulatif</h4>
        <div class="flex justify-between mb-1">
          <span>Sous-total</span>
          <span>{{ safeOrder.subtotal.toFixed(2) }} €</span>
        </div>
        <div class="flex justify-between mb-1">
          <span>Frais de livraison</span>
          <span>{{ safeOrder.shipping.toFixed(2) }} €</span>
        </div>
        <div class="flex justify-between mb-1">
          <span>TVA (20%)</span>
          <span>{{ safeOrder.tax.toFixed(2) }} €</span>
        </div>
        <div class="flex justify-between text-lg font-bold mt-2">
          <span>Total</span>
          <span>{{ safeOrder.total.toFixed(2) }} €</span>
        </div>
      </div>

      <Divider />

      <!-- Adresse de livraison -->
      <div v-if="safeOrder.shippingAddress">
        <h4 class="font-medium mb-2">Adresse de livraison</h4>
        <p>
          {{ safeOrder.shippingAddress.street }},
          <span v-if="safeOrder.shippingAddress.number"
            >n° {{ safeOrder.shippingAddress.number }},</span
          >
          <br />
          {{ safeOrder.shippingAddress.zipcode }} {{ safeOrder.shippingAddress.city }}
        </p>
      </div>

      <!-- Actions sur la commande -->
      <div class="mt-4" v-if="canCancel">
        <Divider />
        <div class="flex justify-end">
          <Button
            label="Annuler la commande"
            icon="pi pi-times"
            severity="danger"
            @click="updateStatus('cancelled')"
            text
          />
        </div>
      </div>
    </div>
  </Dialog>
</template>
