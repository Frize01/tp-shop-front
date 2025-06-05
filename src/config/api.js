import axios from 'axios'

/**
 * Configuration de l'instance Axios principale
 */
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_URL_API,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

/**
 * Stockage pour les contrôleurs d'annulation
 */
const cancelTokens = new Map()

/**
 * Obtient un token CSRF du serveur
 * @returns {Promise} Promise avec la réponse du serveur
 */
const getCsrfToken = () => {
  return instance
    .get('/sanctum/csrf-cookie')
    .then((response) => {
      return response
    })
    .catch((error) => {
      console.error("Erreur lors de l'obtention du token CSRF:", error)
      throw error
    })
}

/**
 * Intercepteur pour les requêtes
 */
instance.interceptors.request.use(
  (config) => {
    // Annuler la requête précédente avec la même clé si elle existe
    if (config.cancelToken) {
      const requestKey = config.url + JSON.stringify(config.params || {})
      if (cancelTokens.has(requestKey)) {
        cancelTokens.get(requestKey)('Requête remplacée par une nouvelle')
      }

      const source = axios.CancelToken.source()
      config.cancelToken = source.token
      cancelTokens.set(requestKey, source.cancel)

      // Nettoyer après un certain délai
      setTimeout(() => {
        cancelTokens.delete(requestKey)
      }, config.timeout || 10000)
    }

    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

/**
 * Intercepteur pour les réponses
 */
instance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    // Ne pas traiter les erreurs d'annulation
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    const originalRequest = error.config

    // Gestion du rafraîchissement de token si 401 (non autorisé)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Tentative de rafraîchissement du token (à implémenter selon votre backend)
        // const refreshResponse = await instance.post('/auth/refresh')
        // localStorage.setItem('auth_token', refreshResponse.data.token)

        // Relancer la requête avec le nouveau token
        return instance(originalRequest)
      } catch (refreshError) {
        // En cas d'échec, rediriger vers la page de connexion
        localStorage.removeItem('auth_token')
        // Si vous utilisez Vue Router:
        // router.push('/login')
        return Promise.reject(refreshError)
      }
    }

    // Traitement des erreurs communes
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      console.error('Erreur API:', error.response.status, error.response.data)

      // Gestion spécifique selon le code d'erreur
      switch (error.response.status) {
        case 403:
          console.error('Accès interdit')
          break
        case 404:
          console.error('Ressource non trouvée')
          break
        case 422:
          console.error('Données invalides:', error.response.data.errors)
          break
        case 500:
          console.error('Erreur serveur')
          break
      }
    } else if (error.request) {
      // La requête a été envoyée mais aucune réponse n'a été reçue
      console.error('Aucune réponse du serveur')
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      console.error('Erreur de configuration:', error.message)
    }

    return Promise.reject(error)
  },
)

/**
 * Méthodes utilitaires pour les appels API courants
 */
const apiService = {
  get: (url, params = {}, config = {}) => instance.get(url, { ...config, params }),

  post: (url, data = {}, config = {}) => instance.post(url, data, config),

  put: (url, data = {}, config = {}) => instance.put(url, data, config),

  patch: (url, data = {}, config = {}) => instance.patch(url, data, config),

  delete: (url, config = {}) => instance.delete(url, config),

  // Méthode avec gestion automatique du token CSRF
  withCsrf: async (apiCall) => {
    await getCsrfToken()
    return apiCall()
  },
}

export { instance, getCsrfToken, apiService }
