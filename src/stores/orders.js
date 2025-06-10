import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export const useOrdersStore = defineStore('orders', () => {
  // État réactif pour stocker les commandes
  const orders = ref([])

  // Référence au store d'authentification
  const authStore = useAuthStore()

  // Chargement initial depuis localStorage et migration des données si nécessaire
  const initializeOrders = () => {
    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) {
      try {
        // Charger les commandes
        const parsedOrders = JSON.parse(savedOrders)

        // Nettoyer et normaliser les données
        const normalizedOrders = parsedOrders.map((order) => {
          // Enlever les champs obsolètes
          const { username, ...cleanOrder } = order

          // Normaliser la structure pour assurer la compatibilité
          return {
            id: cleanOrder.id || generateOrderId(),
            userId: cleanOrder.userId,
            products: cleanOrder.products || cleanOrder.items || [],
            subtotal: cleanOrder.subtotal !== undefined ? cleanOrder.subtotal : 0,
            shipping: cleanOrder.shipping !== undefined ? cleanOrder.shipping : 0,
            tax: cleanOrder.tax !== undefined ? cleanOrder.tax : (cleanOrder.subtotal || 0) * 0.2,
            total: cleanOrder.total !== undefined ? cleanOrder.total : 0,
            status: cleanOrder.status || 'processing',
            date: cleanOrder.date || new Date().toISOString(),
            shippingAddress: cleanOrder.shippingAddress || null,
          }
        })

        // Mettre à jour l'état
        orders.value = normalizedOrders

        // Sauvegarder les commandes normalisées
        saveOrders()

        console.log(
          'Données de commandes normalisées et chargées:',
          normalizedOrders.length,
          'commandes',
        )
      } catch (error) {
        console.error('Erreur lors du chargement des commandes:', error)
        orders.value = []
      }
    }
  }

  // Lancer l'initialisation au démarrage
  initializeOrders()

  // Filtrer les commandes par utilisateur connecté
  const userOrders = computed(() => {
    if (!authStore.isAuthenticated || !authStore.user) return []

    return orders.value
      .filter((order) => order.userId === authStore.user.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // Triées par date décroissante
  })

  // Ajouter une nouvelle commande
  function addOrder(cartItems, subtotal, shipping, total, status = 'processing', orderDate = null) {
    if (!authStore.isAuthenticated || !authStore.user) return false

    const newOrder = {
      id: generateOrderId(),
      userId: authStore.user.id,
      products: cartItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      subtotal,
      shipping,
      tax: total * 0.2, // Estimation de la TVA à 20%
      total,
      status: status,
      date: orderDate || new Date().toISOString(),
      shippingAddress: authStore.user.address
        ? {
            street: authStore.user.address.street || '',
            number: authStore.user.address.number || '',
            city: authStore.user.address.city || '',
            zipcode: authStore.user.address.zipcode || '',
          }
        : null,
    }

    orders.value.push(newOrder)
    saveOrders()

    return newOrder
  }

  // Générer un ID unique pour une commande
  function generateOrderId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 7).toUpperCase()
  }

  // Sauvegarder les commandes dans localStorage
  function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders.value))
  }

  // Supprimer toutes les commandes d'un utilisateur
  function deleteUserOrders(userId) {
    if (!userId) return false

    // Filtrer les commandes pour ne garder que celles des autres utilisateurs
    orders.value = orders.value.filter((order) => order.userId !== userId)

    // Sauvegarder les modifications
    saveOrders()

    return true
  }

  // Mettre à jour le statut d'une commande
  function updateOrderStatus(orderId, newStatus) {
    if (!orderId || !newStatus) return false

    // Chercher la commande
    const orderIndex = orders.value.findIndex((order) => order.id === orderId)
    if (orderIndex === -1) return false

    // Mettre à jour le statut
    orders.value[orderIndex].status = newStatus

    // Sauvegarder les modifications
    saveOrders()

    return true
  }

  return {
    orders,
    userOrders,
    addOrder,
    deleteUserOrders,
    updateOrderStatus,
  }
})
