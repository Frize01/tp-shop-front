import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'

export const useCartStore = defineStore('cart', () => {
  // État réactif pour stocker les articles du panier
  const items = ref([])

  // Référence au store d'authentification
  const authStore = useAuthStore()

  // Chargement initial depuis localStorage
  const initializeCart = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      items.value = JSON.parse(savedCart)
    }
  }

  // Lancer l'initialisation au démarrage
  initializeCart()

  // Observer les changements et mettre à jour localStorage
  watch(
    items,
    (newItems) => {
      localStorage.setItem('cart', JSON.stringify(newItems))
    },
    { deep: true },
  )

  // Getters
  const count = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })
  const isEmpty = computed(() => count.value === 0)

  // Prix des articles sans frais de livraison
  const subtotalPrice = computed(() => {
    return items.value.reduce((total, item) => {
      return total + item.price * item.quantity
    }, 0)
  })

  // Calcul des frais de livraison
  const shippingCost = computed(() => {
    // Frais de livraison par défaut
    const defaultShipping = 10

    // Si le panier est vide, pas de frais de livraison
    if (isEmpty.value) {
      return 0
    }

    // Livraison gratuite si le sous-total est >= 100€
    if (subtotalPrice.value >= 100) {
      return 0
    }

    // Vérifier si l'utilisateur est Swann et qu'on est le 6 juin
    const today = new Date()
    const isJune6 = today.getDate() === 6 && today.getMonth() === 5 // Juin = 5 (les mois commencent à 0)

    if (isJune6 && authStore.isAuthenticated) {
      // Récupérer le prénom de l'utilisateur
      const firstName = authStore.user?.name?.firstname

      // Vérifier si l'utilisateur s'appelle Swann
      if (firstName === 'Swann') {
        return 0 // Livraison gratuite pour Swann le 6 juin
      }
    }

    // Sinon, retourner les frais de livraison par défaut
    return defaultShipping
  })

  // Prix total incluant les frais de livraison
  const totalPrice = computed(() => {
    return subtotalPrice.value + shippingCost.value
  })

  // Actions
  function addItem(product) {
    const existingItem = items.value.find((item) => item.id === product.id)

    if (existingItem) {
      // Si le produit existe déjà, augmenter la quantité
      existingItem.quantity++
    } else {
      // Sinon, ajouter un nouvel article
      items.value.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    }
  }

  function removeItem(productId) {
    const index = items.value.findIndex((item) => item.id === productId)
    if (index !== -1) {
      items.value.splice(index, 1)
    }
  }

  function updateQuantity(productId, quantity) {
    const item = items.value.find((item) => item.id === productId)
    if (item) {
      item.quantity = quantity

      // Si la quantité est 0 ou négative, supprimer l'article
      if (quantity <= 0) {
        removeItem(productId)
      }
    }
  }

  function clearCart() {
    items.value = []
  }

  // Finaliser la commande et l'ajouter à l'historique
  function checkout() {
    // Vérifier que le panier n'est pas vide
    if (isEmpty.value) return false

    // Vérifier que l'utilisateur est connecté
    if (!authStore.isAuthenticated) {
      return { error: 'auth_required' }
    }

    const ordersStore = useOrdersStore()

    // Créer la commande
    const newOrder = ordersStore.addOrder(
      [...items.value], // Items du panier
      subtotalPrice.value, // Sous-total
      shippingCost.value, // Frais de livraison
      totalPrice.value, // Total
    )

    // Si la commande a été créée avec succès, vider le panier
    if (newOrder) {
      clearCart()
      return newOrder
    }

    return false
  }

  return {
    items,
    count,
    isEmpty,
    subtotalPrice,
    shippingCost,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    checkout,
  }
})
