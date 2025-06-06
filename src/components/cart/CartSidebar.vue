<script setup>
import { useCartStore } from '@/stores/cart'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Drawer from 'primevue/drawer'
import InputNumber from 'primevue/inputnumber'

const props = defineProps({
  visible: Boolean,
})

const emit = defineEmits(['update:visible'])
const router = useRouter()
const toast = useToast()
const cartStore = useCartStore()

const updateVisible = (value) => {
  emit('update:visible', value)
}

// Fonction pour valider la commande
const processCheckout = () => {
  const result = cartStore.checkout()

  if (result && result.error === 'auth_required') {
    toast.add({
      severity: 'warn',
      summary: 'Connexion requise',
      detail: 'Veuillez vous connecter pour finaliser votre commande',
      life: 3000,
    })

    updateVisible(false)
    router.push('/auth')
  } else if (result) {
    toast.add({
      severity: 'success',
      summary: 'Commande validée',
      detail: 'Votre commande a été enregistrée avec succès',
      life: 3000,
    })

    updateVisible(false)
    router.push('/orders')
  } else {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de valider votre commande',
      life: 3000,
    })
  }
}
</script>

<template>
  <Drawer
    v-model:visible="props.visible"
    position="right"
    :style="{ width: 'auto' }"
    @update:visible="updateVisible"
  >
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Votre Panier</h2>
        <Button icon="pi pi-times" text rounded aria-label="Fermer" @click="updateVisible(false)" />
      </div>
    </template>

    <div v-if="cartStore.isEmpty" class="p-4 text-center">
      <i class="pi pi-shopping-cart text-4xl text-gray-300 mb-3"></i>
      <p class="text-gray-500">Votre panier est vide</p>
      <Button label="Continuer vos achats" class="mt-4" @click="updateVisible(false)" />
    </div>

    <div v-else class="flex flex-col h-full">
      <!-- Liste des produits -->
      <div>
        <div
          v-for="item in cartStore.items"
          :key="item.id"
          class="border-b p-4 flex items-center gap-4"
        >
          <img :src="item.image" :alt="item.title" class="w-16 h-16 object-cover rounded" />
          <div class="flex-grow">
            <h3 class="font-medium">{{ item.title }}</h3>
            <div class="text-primary font-bold">{{ item.price }} €</div>
          </div>
          <div class="flex flex-col">
            <InputNumber
              v-model="item.quantity"
              showButtons
              buttonLayout="horizontal"
              :min="1"
              :max="99"
              :step="1"
              @update:modelValue="cartStore.updateQuantity(item.id, item.quantity)"
              class="w-20"
              :inputStyle="{ width: '2rem' }"
              size="small"
            />
            <Button
              icon="pi pi-trash"
              text
              severity="danger"
              rounded
              size="small"
              @click="cartStore.removeItem(item.id)"
            />
          </div>
        </div>
      </div>

      <!-- Résumé et boutons -->
      <div class="border-t p-4 mt-auto">
        <div class="flex flex-col gap-2 mb-4">
          <div class="flex justify-between">
            <span class="text-gray-600">Sous-total</span>
            <span>{{ cartStore.subtotalPrice.toFixed(2) }} €</span>
          </div>
          <div class="flex justify-between">
            <div class="flex items-center">
              <span class="text-gray-600">Frais de livraison</span>
              <span
                v-if="cartStore.shippingCost === 0"
                class="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full"
              >
                Gratuit
              </span>
            </div>
            <span>{{ cartStore.shippingCost.toFixed(2) }} €</span>
          </div>
          <div class="flex justify-between pt-2 border-t mt-1">
            <span class="font-semibold">Total</span>
            <span class="font-bold text-lg">{{ cartStore.totalPrice.toFixed(2) }} €</span>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <Button
            label="Vider le panier"
            icon="pi pi-trash"
            outlined
            severity="danger"
            class="w-full"
            @click="cartStore.clearCart()"
          />
          <Button
            label="Commander"
            icon="pi pi-check"
            class="w-full"
            severity="success"
            @click="processCheckout"
          />
        </div>
      </div>
    </div>
  </Drawer>
</template>

<style scoped>
:deep(.p-inputnumber-input) {
  width: 2rem !important;
  text-align: center;
}
</style>
