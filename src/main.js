import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import Ripple from 'primevue/ripple'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.directive('ripple', Ripple)

app.mount('#app')
