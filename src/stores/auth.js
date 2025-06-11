import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiService } from '@/config/api'

// Fonctions de chiffrement/déchiffrement simple
function encryptPassword(password) {
  // Utilisation de btoa pour encoder en Base64 + un peu de mélange
  return btoa(password.split('').reverse().join('') + '_secure')
}

function decryptPassword(encryptedPassword) {
  try {
    // Décode et enlève le suffixe, puis inverse les caractères
    const decoded = atob(encryptedPassword)
    return decoded
      .substring(0, decoded.length - 7)
      .split('')
      .reverse()
      .join('')
  } catch (e) {
    console.error('Erreur de déchiffrement:', e)
    return ''
  }
}

export const useAuthStore = defineStore('auth', () => {
  // État
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userFullName = computed(() => {
    if (!user.value || !user.value.name) return ''
    const firstname = user.value.name.firstname || ''
    const lastname = user.value.name.lastname || ''
    return `${firstname} ${lastname}`.trim()
  })

  // Actions
  function initAuth() {
    // Récupère le token depuis localStorage s'il existe
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken) {
      token.value = storedToken
      fetchUserProfile()
    }
  }

  async function login(credentials) {
    loading.value = true
    error.value = null

    try {
      const response = await apiService.post('/auth/login', credentials)
      const authToken = response.data.token

      // Stockage du token
      token.value = authToken
      localStorage.setItem('auth_token', authToken)

      // Stockage temporaire des identifiants pour la récupération du profil
      localStorage.setItem(
        'temp_credentials',
        JSON.stringify({
          username: credentials.username,
          password: encryptPassword(credentials.password),
        }),
      )

      // Récupérer les informations de l'utilisateur
      await fetchUserProfile()

      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la connexion'
      token.value = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('temp_credentials')
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    loading.value = true
    error.value = null

    try {
      console.log("Données d'inscription reçues:", JSON.stringify(userData, null, 2))

      // Formatage des données selon le modèle attendu par l'API
      const formattedData = {
        email: userData.email,
        username: userData.username,
        password: userData.password,
        // Déplacer firstname et lastname au premier niveau
        firstname: userData.name.firstname,
        lastname: userData.name.lastname,
        // L'adresse selon le format de l'API
        address: {
          city: userData.address.city,
          street: userData.address.street,
          geolocation: {
            lat: userData.address.geolocation.lat || '0',
            long: userData.address.geolocation.long || '0',
          },
        },
        // Ces champs sont au premier niveau dans l'API
        number: userData.address.number,
        zipcode: userData.address.zipcode,
        phone: userData.phone,
      }

      console.log("Données formatées envoyées à l'API:", JSON.stringify(formattedData, null, 2))
      const response = await apiService.post('/users', formattedData)
      console.log("Réponse d'inscription réussie:", response.data)
      return response.data
    } catch (err) {
      console.error("Erreur d'inscription détaillée:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        responseData: err.response?.data,
        requestData: userData,
      })

      error.value =
        err.response?.data?.message ||
        (err.response?.status === 400
          ? 'Format de données incorrect'
          : "Erreur lors de l'inscription")
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchUserProfile() {
    if (!token.value) return

    loading.value = true
    try {
      // Récupérer tous les utilisateurs et filtrer côté client
      // car l'API ne propose pas d'endpoint spécifique pour le profil
      const response = await apiService.get('/users')
      console.log('API Response (users):', response.data)

      // On suppose que les informations d'identification (username, password)
      // sont stockées temporairement pendant la connexion
      const credentials = JSON.parse(localStorage.getItem('temp_credentials') || '{}')
      console.log('Stored credentials:', { username: credentials.username })

      // Déchiffrer le mot de passe si nécessaire
      const password = credentials.password ? decryptPassword(credentials.password) : ''

      if (response.data && Array.isArray(response.data)) {
        // Recherche de l'utilisateur par nom d'utilisateur et mot de passe
        const foundUser = response.data.find(
          (u) => u.username === credentials.username && u.password === password,
        )
        console.log('Found user:', foundUser)

        if (foundUser) {
          user.value = foundUser
          // Ne pas supprimer les identifiants temporaires pour permettre la reconnexion après rafraîchissement
          // localStorage.removeItem('temp_credentials')
        } else {
          throw new Error('Utilisateur non trouvé')
        }
      } else {
        throw new Error('Format de réponse inattendu')
      }
    } catch (err) {
      console.error('Erreur profile:', err)
      error.value = 'Erreur lors de la récupération du profil'
      logout()
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('temp_credentials')
  }

  // Fonction pour supprimer un compte utilisateur
  async function deleteAccount() {
    if (!user.value || !user.value.id) {
      error.value = 'Impossible de supprimer le compte : utilisateur non connecté'
      return false
    }

    loading.value = true
    error.value = null

    try {
      // Importations dynamiques pour éviter les problèmes de dépendances circulaires
      const { useCartStore } = await import('./cart')
      const { useOrdersStore } = await import('./orders')

      const cartStore = useCartStore()
      const ordersStore = useOrdersStore()

      // Récupérer l'ID de l'utilisateur avant la déconnexion
      const userId = user.value.id

      // Appel à l'API pour supprimer l'utilisateur
      const response = await apiService.delete(`/users/${userId}`)

      // Supprimer les commandes de l'utilisateur
      ordersStore.deleteUserOrders(userId)

      // Vider le panier
      cartStore.clearCart()

      // Si la suppression est réussie, on déconnecte l'utilisateur
      logout()
      return true
    } catch (err) {
      console.error('Erreur lors de la suppression du compte:', err)
      error.value = 'Erreur lors de la suppression du compte'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    // État
    user,
    token,
    loading,
    error,

    // Getters
    isAuthenticated,
    userFullName,

    // Actions
    initAuth,
    login,
    register,
    fetchUserProfile,
    logout,
    deleteAccount,
  }
})
