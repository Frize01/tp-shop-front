<script setup>
import { ref } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import Button from 'primevue/button'
import toastService from '@/services/toast'

const ordersStore = useOrdersStore()
const authStore = useAuthStore()
const loading = ref(false)

// Liste de produits factices pour les commandes de test
const mockProducts = [
  {
    id: 1,
    title: 'Smartphone Galaxy Z20',
    price: 899.99,
    image: 'https://via.placeholder.com/150',
    category: 'electronics',
  },
  {
    id: 2,
    title: 'Casque audio sans fil Pro',
    price: 249.99,
    image: 'https://via.placeholder.com/150',
    category: 'electronics',
  },
  {
    id: 3,
    title: 'Chaussures de sport Air Max',
    price: 129.99,
    image: 'https://via.placeholder.com/150',
    category: 'clothing',
  },
  {
    id: 4,
    title: 'Livre "Le Guide du développeur Vue.js"',
    price: 39.99,
    image: 'https://via.placeholder.com/150',
    category: 'books',
  },
  {
    id: 5,
    title: 'Montre connectée Fitness+',
    price: 179.99,
    image: 'https://via.placeholder.com/150',
    category: 'electronics',
  },
]

// Fonction pour générer un nombre aléatoire entre min et max
function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Fonction pour créer une commande avec des produits aléatoires
function addMockOrder() {
  if (!authStore.isAuthenticated) {
    toastService.error('Vous devez être connecté pour créer une commande de test')
    return
  }

  loading.value = true

  try {
    // Sélectionner entre 1 et 4 produits aléatoires
    const numProducts = getRandomInt(1, 4)
    const mockItems = []
    let subtotal = 0

    for (let i = 0; i < numProducts; i++) {
      // Sélectionner un produit aléatoire
      const productIndex = getRandomInt(0, mockProducts.length - 1)
      const product = mockProducts[productIndex]
      const quantity = getRandomInt(1, 3)

      // Vérifier si le produit est déjà dans le panier
      const existingItem = mockItems.find((item) => item.product.id === product.id)
      if (existingItem) {
        existingItem.quantity += quantity
        subtotal += product.price * quantity
      } else {
        mockItems.push({
          product: product,
          quantity: quantity,
        })
        subtotal += product.price * quantity
      }
    }

    // Calculer les frais de livraison (gratuit au-dessus de 100€)
    const shipping = subtotal >= 100 ? 0 : 5.99

    // Calculer la TVA (20%)
    const tax = subtotal * 0.2

    // Calculer le total
    const total = subtotal + shipping + tax

    // Générer un statut aléatoire
    const statuses = ['processing', 'shipped', 'completed']
    const randomStatus = statuses[getRandomInt(0, statuses.length - 1)]

    // Créer la commande avec une date aléatoire dans les 30 derniers jours
    const randomDaysAgo = getRandomInt(0, 30)
    const orderDate = new Date()
    orderDate.setDate(orderDate.getDate() - randomDaysAgo)

    // Ajouter la commande
    const newOrder = ordersStore.addOrder(
      mockItems,
      subtotal,
      shipping,
      total,
      randomStatus,
      orderDate.toISOString(),
    )

    toastService.success('Commande de test ajoutée avec succès !')
  } catch (error) {
    console.error('Erreur lors de la création de la commande de test:', error)
    toastService.error('Erreur lors de la création de la commande de test')
  } finally {
    loading.value = false
  }
}

// Fonction pour effacer toutes les commandes (uniquement pour le débogage)
function clearAllOrders() {
  if (
    confirm(
      'Êtes-vous sûr de vouloir supprimer toutes les commandes ? Cette action est irréversible.',
    )
  ) {
    localStorage.removeItem('orders')
    location.reload()
    toastService.success('Toutes les commandes ont été supprimées')
  }
}
</script>

<template>
  <div class="mt-4">
    <Button
      label="Ajouter une commande de test"
      icon="pi pi-plus"
      @click="addMockOrder"
      :loading="loading"
      class="mr-2"
    />
    <Button
      label="Réinitialiser les commandes"
      icon="pi pi-trash"
      severity="danger"
      text
      @click="clearAllOrders"
    />
  </div>
</template>
