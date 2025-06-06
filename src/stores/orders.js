import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export const useOrdersStore = defineStore('orders', () => {
  // État réactif pour stocker les commandes
  const orders = ref([])

  // Référence au store d'authentification
  const authStore = useAuthStore() // Chargement initial depuis localStorage et migration des données si nécessaire
  const initializeOrders = () => {
    const savedOrders = localStorage.getItem('orders')
    if (savedOrders) {
      // Charger les commandes
      const parsedOrders = JSON.parse(savedOrders)

      // Nettoyer les données obsolètes (supprimer le champ username)
      const cleanedOrders = parsedOrders.map((order) => {
        // Créer une copie de la commande sans le champ username
        const { username, ...cleanOrder } = order
        return cleanOrder
      })

      // Mettre à jour l'état
      orders.value = cleanedOrders

      // Sauvegarder les commandes nettoyées
      saveOrders()
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
  function addOrder(cartItems, subtotal, shipping, total) {
    if (!authStore.isAuthenticated || !authStore.user) return false

    const newOrder = {
      id: generateOrderId(),
      userId: authStore.user.id, // On garde uniquement l'ID utilisateur qui est unique
      items: [...cartItems],
      subtotal,
      shipping,
      total,
      status: 'validée',
      date: new Date().toISOString(),
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

  return {
    orders,
    userOrders,
    addOrder,
    deleteUserOrders,
  }
})
