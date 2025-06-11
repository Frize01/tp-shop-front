<script setup>
import { ref } from 'vue'
import Card from 'primevue/card'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const activeTabIndex = ref(0)
const formSubmitting = ref(false)
const formError = ref('')

// Gérer les événements des formulaires
const handleLoginSuccess = () => {
  formError.value = ''
}

const handleLoginError = (error) => {
  console.error('Erreur de connexion:', error)
}

const handleRegisterSuccess = () => {
  formError.value = ''
}

const handleRegisterError = (error) => {
  console.error('Erreur d\'inscription:', error)
}

// Changer d'onglet
const switchToRegister = () => {
  activeTabIndex.value = 1
}

const switchToLogin = () => {
  activeTabIndex.value = 0
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen p-4">
    <Card class="w-full max-w-3xl">
      <template #title>
        <h1 class="text-2xl font-bold text-center text-primary">Bienvenue sur ShopApp</h1>
      </template>
      <template #content>
        <TabView v-model:activeIndex="activeTabIndex">
          <!-- Onglet de connexion -->
          <TabPanel header="Connexion">
            <div class="p-3">
              <LoginForm 
                v-model:formSubmitting="formSubmitting"
                v-model:formError="formError"
                @login-success="handleLoginSuccess"
                @login-error="handleLoginError"
              />
              
              <div class="text-center mt-4">
                <span class="text-sm">
                  Pas encore de compte ?
                  <a href="#" @click.prevent="switchToRegister" class="text-primary font-medium">
                    S'inscrire
                  </a>
                </span>
              </div>
            </div>
          </TabPanel>

          <!-- Onglet d'inscription -->
          <TabPanel header="Inscription">
            <div class="p-3">
              <RegisterForm 
                v-model:formSubmitting="formSubmitting"
                v-model:formError="formError"
                @register-success="handleRegisterSuccess"
                @register-error="handleRegisterError"
              />
              
              <div class="text-center mt-4">
                <span class="text-sm">
                  Déjà un compte ?
                  <a href="#" @click.prevent="switchToLogin" class="text-primary font-medium">
                    Se connecter
                  </a>
                </span>
              </div>
            </div>
          </TabPanel>
        </TabView>
      </template>
    </Card>
  </div>
</template>
