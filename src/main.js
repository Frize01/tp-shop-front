import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import Ripple from 'primevue/ripple'
import 'primeicons/primeicons.css'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(ConfirmationService)
app.use(ToastService)
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.directive('ripple', Ripple)

// Initialize auth store
const authStore = useAuthStore()
authStore.initAuth()

app.mount('#app')
