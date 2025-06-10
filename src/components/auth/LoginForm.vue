<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import toastService from '@/services/toast'

const props = defineProps({
  formSubmitting: {
    type: Boolean,
    default: false,
  },
  formError: {
    type: String,
    default: '',
  },
})

const emit = defineEmits([
  'login-success',
  'login-error',
  'update:formSubmitting',
  'update:formError',
])

const router = useRouter()
const authStore = useAuthStore()

// Formulaire de connexion
const loginForm = reactive({
  username: '',
  password: '',
})

// Validation des formulaires
const loginFormErrors = reactive({
  username: '',
  password: '',
})

// Valide le formulaire de connexion
function validateLoginForm() {
  let isValid = true
  const emptyFields = []

  // Réinitialisation des erreurs
  loginFormErrors.username = ''
  loginFormErrors.password = ''

  // Validation du nom d'utilisateur
  if (!loginForm.username.trim()) {
    loginFormErrors.username = "Nom d'utilisateur requis"
    emptyFields.push('username')
    isValid = false
  }

  // Validation du mot de passe
  if (!loginForm.password) {
    loginFormErrors.password = 'Mot de passe requis'
    emptyFields.push('password')
    isValid = false
  }

  return isValid
}

// Soumission du formulaire de connexion
async function handleLogin() {
  if (validateLoginForm()) {
    emit('update:formSubmitting', true)
    emit('update:formError', '')

    try {
      console.log('Tentative de connexion avec:', {
        username: loginForm.username,
        passwordLength: loginForm.password.length,
      })

      await authStore.login(loginForm)
      console.log('Connexion réussie')
      toastService.success('Connexion réussie ! Bienvenue.')
      router.push('/')
      emit('login-success')
    } catch (error) {
      console.error('Erreur de connexion:', error)
      const errorMessage =
        error.response?.status === 401
          ? 'Identifiants incorrects. Veuillez réessayer.'
          : error.response?.data?.message ||
            'Échec de la connexion. Veuillez vérifier vos identifiants.'

      toastService.error(errorMessage)
      emit('update:formError', errorMessage)
      emit('login-error', error)
    } finally {
      emit('update:formSubmitting', false)
    }
  }
}
</script>

<template>
  <form @submit.prevent="handleLogin" class="space-y-4">
    <div class="field">
      <label for="username" class="block mb-1">Nom d'utilisateur</label>
      <InputText
        id="username"
        v-model="loginForm.username"
        class="w-full"
        :class="{ 'p-invalid': loginFormErrors.username }"
      />
      <small class="text-red-500" v-if="loginFormErrors.username">
        {{ loginFormErrors.username }}
      </small>
    </div>

    <div class="field">
      <label for="password" class="block mb-1">Mot de passe</label>
      <Password
        id="password"
        v-model="loginForm.password"
        toggleMask
        class="w-full"
        :feedback="false"
        :class="{ 'p-invalid': loginFormErrors.password }"
      />
      <small class="text-red-500" v-if="loginFormErrors.password">
        {{ loginFormErrors.password }}
      </small>
    </div>

    <div class="pt-2">
      <Button type="submit" label="Se connecter" class="w-full" :loading="props.formSubmitting" />
    </div>

    <Message v-if="props.formError" severity="error" :text="props.formError" class="w-full mt-3" />
  </form>
</template>
