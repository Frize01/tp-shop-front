// Toast Service pour gérer les notifications dans l'application
import { reactive } from 'vue'

// Types de notifications
export const ToastTypes = {
  SUCCESS: 'success',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
}

// Configuration initiale
const state = reactive({
  toasts: [],
  lastId: 0,
})

// Service de toast
export const toastService = {
  // Ajouter une notification
  add(options) {
    const id = ++state.lastId
    const defaults = {
      id,
      summary: 'Notification',
      detail: '',
      life: 3000,
      severity: ToastTypes.INFO,
      closable: true,
    }

    const toast = { ...defaults, ...options }
    state.toasts.push(toast)

    // Auto-suppression après expiration
    if (toast.life > 0) {
      setTimeout(() => {
        this.remove(id)
      }, toast.life)
    }

    return id
  },

  // Raccourcis pour les différents types de notifications
  success(detail, options = {}) {
    return this.add({
      severity: ToastTypes.SUCCESS,
      summary: 'Succès',
      detail,
      ...options,
    })
  },

  info(detail, options = {}) {
    return this.add({
      severity: ToastTypes.INFO,
      summary: 'Information',
      detail,
      ...options,
    })
  },

  warn(detail, options = {}) {
    return this.add({
      severity: ToastTypes.WARN,
      summary: 'Attention',
      detail,
      ...options,
    })
  },

  error(detail, options = {}) {
    return this.add({
      severity: ToastTypes.ERROR,
      summary: 'Erreur',
      detail,
      life: 5000,
      ...options,
    })
  },

  // Supprimer une notification
  remove(id) {
    const index = state.toasts.findIndex((toast) => toast.id === id)
    if (index !== -1) {
      state.toasts.splice(index, 1)
    }
  },

  // Supprimer toutes les notifications
  clear() {
    state.toasts = []
  },

  // Obtenir toutes les notifications actuelles
  getToasts() {
    return state.toasts
  },
}

export default toastService
