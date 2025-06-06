<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Card from 'primevue/card'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Steps from 'primevue/steps'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import Divider from 'primevue/divider'

const router = useRouter()
const authStore = useAuthStore()
const activeTabIndex = ref(0)
const registrationStep = ref(0)
const formSubmitting = ref(false)
const formError = ref('')

// Étapes du formulaire d'inscription
const registrationSteps = [
  { label: 'Informations de compte', icon: 'pi pi-user' },
  { label: 'Informations personnelles', icon: 'pi pi-id-card' },
  { label: 'Adresse', icon: 'pi pi-home' },
  { label: 'Confirmation', icon: 'pi pi-check' },
]

// Formulaire de connexion
const loginForm = reactive({
  username: '',
  password: '',
})

// Formulaire d'inscription complet
const registerForm = reactive({
  // Étape 1: Informations de compte
  email: '',
  username: '',
  password: '',
  passwordConfirm: '',

  // Étape 2: Informations personnelles
  firstname: '',
  lastname: '',
  phone: '',

  // Étape 3: Adresse
  address: {
    street: '',
    city: '',
    geolocation: {
      lat: '',
      long: '',
    },
  },
  number: '',
  zipcode: '',
})

// Validation des formulaires
const loginFormErrors = reactive({
  username: '',
  password: '',
})

const registerFormErrors = reactive({
  email: '',
  username: '',
  password: '',
  passwordConfirm: '',
  firstname: '',
  lastname: '',
  phone: '',
  street: '',
  city: '',
  number: '',
  zipcode: '',
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

  if (!isValid) {
    console.log('Validation du formulaire de connexion échouée:', {
      champManquants: emptyFields,
      donneesFormulaire: { ...loginForm },
      erreurs: { ...loginFormErrors },
    })
  }

  return isValid
}

// Valide une étape du formulaire d'inscription
function validateRegistrationStep(step) {
  let isValid = true
  const emptyFields = []

  switch (step) {
    case 0: // Informations de compte
      // Validation de l'email
      if (!registerForm.email.trim()) {
        registerFormErrors.email = 'Email requis'
        emptyFields.push('email')
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
        registerFormErrors.email = "Format d'email invalide"
        isValid = false
      } else {
        registerFormErrors.email = ''
      }

      // Validation du nom d'utilisateur
      if (!registerForm.username.trim()) {
        registerFormErrors.username = "Nom d'utilisateur requis"
        emptyFields.push('username')
        isValid = false
      } else {
        registerFormErrors.username = ''
      }

      // Validation du mot de passe
      if (!registerForm.password) {
        registerFormErrors.password = 'Mot de passe requis'
        emptyFields.push('password')
        isValid = false
      } else if (registerForm.password.length < 6) {
        registerFormErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
        isValid = false
      } else {
        registerFormErrors.password = ''
      }

      // Validation de la confirmation du mot de passe
      if (registerForm.password !== registerForm.passwordConfirm) {
        registerFormErrors.passwordConfirm = 'Les mots de passe ne correspondent pas'
        emptyFields.push('passwordConfirm')
        isValid = false
      } else {
        registerFormErrors.passwordConfirm = ''
      }
      break

    case 1: // Informations personnelles
      // Validation du prénom
      if (!registerForm.firstname.trim()) {
        registerFormErrors.firstname = 'Prénom requis'
        emptyFields.push('firstname')
        isValid = false
      } else {
        registerFormErrors.firstname = ''
      }

      // Validation du nom
      if (!registerForm.lastname.trim()) {
        registerFormErrors.lastname = 'Nom requis'
        emptyFields.push('lastname')
        isValid = false
      } else {
        registerFormErrors.lastname = ''
      }

      // Validation du téléphone
      if (!registerForm.phone.trim()) {
        registerFormErrors.phone = 'Numéro de téléphone requis'
        emptyFields.push('phone')
        isValid = false
      } else {
        registerFormErrors.phone = ''
      }
      break

    case 2: // Adresse
      // Validation de la rue
      if (!registerForm.address.street.trim()) {
        registerFormErrors.street = 'Rue requise'
        emptyFields.push('address.street')
        isValid = false
      } else {
        registerFormErrors.street = ''
      }

      // Validation de la ville
      if (!registerForm.address.city.trim()) {
        registerFormErrors.city = 'Ville requise'
        emptyFields.push('address.city')
        isValid = false
      } else {
        registerFormErrors.city = ''
      }

      // Validation du numéro
      if (!registerForm.number) {
        registerFormErrors.number = 'Numéro requis'
        emptyFields.push('number')
        isValid = false
      } else {
        registerFormErrors.number = ''
      }

      // Validation du code postal
      if (!registerForm.zipcode.trim()) {
        registerFormErrors.zipcode = 'Code postal requis'
        emptyFields.push('zipcode')
        isValid = false
      } else {
        registerFormErrors.zipcode = ''
      }
      break
  }

  if (!isValid) {
    console.log(`Validation de l'étape ${step} du formulaire d'inscription échouée:`, {
      étape: step,
      champManquants: emptyFields,
      donnéesFormulaire: JSON.parse(JSON.stringify(registerForm)),
      erreurs: { ...registerFormErrors },
    })
  }

  return isValid
}

// Fonction de connexion
async function handleLogin() {
  if (!validateLoginForm()) return

  formError.value = ''
  formSubmitting.value = true

  try {
    const success = await authStore.login(loginForm)
    if (success) {
      router.push('/')
    } else {
      formError.value =
        authStore.error || 'Échec de la connexion. Veuillez vérifier vos identifiants.'
      console.error('Échec de connexion:', {
        error: authStore.error,
        credentials: { username: loginForm.username, passwordLength: loginForm.password.length },
      })
    }
  } catch (error) {
    formError.value = "Une erreur s'est produite lors de la connexion."
    console.error('Erreur de connexion détaillée:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      stack: error.stack,
    })
  } finally {
    formSubmitting.value = false
  }
}

// Navigation entre les étapes du formulaire d'inscription
function goToNextStep() {
  if (validateRegistrationStep(registrationStep.value)) {
    registrationStep.value++
  }
}

function goToPreviousStep() {
  registrationStep.value--
}

// Fonction d'inscription
async function handleRegister() {
  // Vérification que toutes les étapes sont valides
  for (let step = 0; step < 3; step++) {
    if (!validateRegistrationStep(step)) {
      registrationStep.value = step
      console.error(`Validation échouée à l'étape ${step} de l'inscription`, {
        currentStep: step,
        formState: JSON.parse(JSON.stringify(registerForm)),
      })
      return
    }
  }

  formError.value = ''
  formSubmitting.value = true

  try {
    // Préparation des données d'utilisateur
    const userData = {
      email: registerForm.email,
      username: registerForm.username,
      password: registerForm.password,
      name: {
        firstname: registerForm.firstname,
        lastname: registerForm.lastname,
      },
      phone: registerForm.phone,
      address: {
        street: registerForm.address.street,
        city: registerForm.address.city,
        number: parseInt(registerForm.number) || 0,
        zipcode: registerForm.zipcode,
        geolocation: {
          lat: registerForm.address.geolocation.lat || '0',
          long: registerForm.address.geolocation.long || '0',
        },
      },
    }

    console.log("Tentative d'inscription avec les données:", JSON.stringify(userData, null, 2))
    await authStore.register(userData)

    // Après l'inscription réussie, tentative de connexion
    const loginSuccess = await authStore.login({
      username: registerForm.username,
      password: registerForm.password,
    })

    if (loginSuccess) {
      router.push('/')
    } else {
      activeTabIndex.value = 0 // Basculer vers l'onglet de connexion
      formError.value = 'Inscription réussie ! Veuillez vous connecter.'
    }
  } catch (error) {
    console.error("Erreur détaillée d'inscription:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      stack: error.stack,
    })

    // Message d'erreur spécifique pour l'erreur 400
    if (error.response?.status === 400) {
      formError.value =
        'Format de données incorrect. Vérifiez que tous les champs sont correctement remplis.'
    } else {
      formError.value = authStore.error || "Une erreur s'est produite lors de l'inscription."
    }
  } finally {
    formSubmitting.value = false
  }
}
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100 p-4">
    <Card class="w-full max-w-3xl">
      <template #title>
        <h1 class="text-2xl font-bold text-center text-primary">Bienvenue sur ShopApp</h1>
      </template>
      <template #content>
        <TabView v-model:activeIndex="activeTabIndex">
          <!-- Onglet de connexion -->
          <TabPanel header="Connexion">
            <form @submit.prevent="handleLogin" class="space-y-4 p-3">
              <Message v-if="formError" severity="error" :closable="false">{{ formError }}</Message>

              <div class="field">
                <label for="username" class="block text-sm font-medium mb-1"
                  >Nom d'utilisateur</label
                >
                <InputText
                  id="username"
                  v-model="loginForm.username"
                  class="w-full"
                  :class="{ 'p-invalid': loginFormErrors.username }"
                />
                <small v-if="loginFormErrors.username" class="p-error">{{
                  loginFormErrors.username
                }}</small>
              </div>

              <div class="field">
                <label for="password" class="block text-sm font-medium mb-1">Mot de passe</label>
                <Password
                  id="password"
                  v-model="loginForm.password"
                  class="w-full"
                  :feedback="false"
                  toggleMask
                  :class="{ 'p-invalid': loginFormErrors.password }"
                />
                <small v-if="loginFormErrors.password" class="p-error">{{
                  loginFormErrors.password
                }}</small>
              </div>

              <div class="flex justify-center mt-4">
                <Button
                  type="submit"
                  label="Se connecter"
                  icon="pi pi-sign-in"
                  :loading="formSubmitting"
                  class="w-full"
                />
              </div>

              <div class="text-center mt-3">
                <span class="text-sm">
                  Pas encore de compte ?
                  <a href="#" @click.prevent="activeTabIndex = 1" class="text-primary font-medium">
                    S'inscrire
                  </a>
                </span>
              </div>
            </form>
          </TabPanel>

          <!-- Onglet d'inscription -->
          <TabPanel header="Inscription">
            <div class="p-3">
              <Message v-if="formError" severity="error" :closable="false">{{ formError }}</Message>

              <!-- Étape 1: Informations de compte -->
              <div v-if="registrationStep === 0" class="space-y-4">
                <div class="field">
                  <label for="reg-email" class="block text-sm font-medium mb-1">Email</label>
                  <InputText
                    id="reg-email"
                    v-model="registerForm.email"
                    class="w-full"
                    :class="{ 'p-invalid': registerFormErrors.email }"
                  />
                  <small v-if="registerFormErrors.email" class="p-error">{{
                    registerFormErrors.email
                  }}</small>
                </div>

                <div class="field">
                  <label for="reg-username" class="block text-sm font-medium mb-1"
                    >Nom d'utilisateur</label
                  >
                  <InputText
                    id="reg-username"
                    v-model="registerForm.username"
                    class="w-full"
                    :class="{ 'p-invalid': registerFormErrors.username }"
                  />
                  <small v-if="registerFormErrors.username" class="p-error">{{
                    registerFormErrors.username
                  }}</small>
                </div>

                <div class="field">
                  <label for="reg-password" class="block text-sm font-medium mb-1"
                    >Mot de passe</label
                  >
                  <Password
                    id="reg-password"
                    v-model="registerForm.password"
                    class="w-full"
                    :class="{ 'p-invalid': registerFormErrors.password }"
                    toggleMask
                  />
                  <small v-if="registerFormErrors.password" class="p-error">{{
                    registerFormErrors.password
                  }}</small>
                </div>

                <div class="field">
                  <label for="reg-password-confirm" class="block text-sm font-medium mb-1"
                    >Confirmer le mot de passe</label
                  >
                  <Password
                    id="reg-password-confirm"
                    v-model="registerForm.passwordConfirm"
                    class="w-full"
                    :feedback="false"
                    toggleMask
                    :class="{ 'p-invalid': registerFormErrors.passwordConfirm }"
                  />
                  <small v-if="registerFormErrors.passwordConfirm" class="p-error">{{
                    registerFormErrors.passwordConfirm
                  }}</small>
                </div>
              </div>

              <!-- Étape 2: Informations personnelles -->
              <div v-else-if="registrationStep === 1" class="space-y-4">
                <div class="field">
                  <label for="reg-firstname" class="block text-sm font-medium mb-1">Prénom</label>
                  <InputText
                    id="reg-firstname"
                    v-model="registerForm.firstname"
                    class="w-full"
                    :class="{ 'p-invalid': registerFormErrors.firstname }"
                  />
                  <small v-if="registerFormErrors.firstname" class="p-error">{{
                    registerFormErrors.firstname
                  }}</small>
                </div>

                <div class="field">
                  <label for="reg-lastname" class="block text-sm font-medium mb-1">Nom</label>
                  <InputText
                    id="reg-lastname"
                    v-model="registerForm.lastname"
                    class="w-full"
                    :class="{ 'p-invalid': registerFormErrors.lastname }"
                  />
                  <small v-if="registerFormErrors.lastname" class="p-error">{{
                    registerFormErrors.lastname
                  }}</small>
                </div>

                <div class="field">
                  <label for="reg-phone" class="block text-sm font-medium mb-1">Téléphone</label>
                  <InputText
                    id="reg-phone"
                    v-model="registerForm.phone"
                    class="w-full"
                    :class="{ 'p-invalid': registerFormErrors.phone }"
                  />
                  <small v-if="registerFormErrors.phone" class="p-error">{{
                    registerFormErrors.phone
                  }}</small>
                </div>
              </div>

              <!-- Étape 3: Adresse -->
              <div v-else-if="registrationStep === 2" class="space-y-4">
                <div class="field">
                  <label for="reg-street" class="block text-sm font-medium mb-1">Rue</label>
                  <InputText
                    id="reg-street"
                    v-model="registerForm.address.street"
                    class="w-full"
                    :class="{ 'p-invalid': registerFormErrors.street }"
                  />
                  <small v-if="registerFormErrors.street" class="p-error">{{
                    registerFormErrors.street
                  }}</small>
                </div>

                <div class="field">
                  <label for="reg-number" class="block text-sm font-medium mb-1">Numéro</label>
                  <InputText
                    id="reg-number"
                    v-model="registerForm.number"
                    class="w-full"
                    :class="{ 'p-invalid': registerFormErrors.number }"
                  />
                  <small v-if="registerFormErrors.number" class="p-error">{{
                    registerFormErrors.number
                  }}</small>
                </div>

                <div class="field">
                  <label for="reg-city" class="block text-sm font-medium mb-1">Ville</label>
                  <InputText
                    id="reg-city"
                    v-model="registerForm.address.city"
                    class="w-full"
                    :class="{ 'p-invalid': registerFormErrors.city }"
                  />
                  <small v-if="registerFormErrors.city" class="p-error">{{
                    registerFormErrors.city
                  }}</small>
                </div>

                <div class="field">
                  <label for="reg-zipcode" class="block text-sm font-medium mb-1"
                    >Code postal</label
                  >
                  <InputText
                    id="reg-zipcode"
                    v-model="registerForm.zipcode"
                    class="w-full"
                    :class="{ 'p-invalid': registerFormErrors.zipcode }"
                  />
                  <small v-if="registerFormErrors.zipcode" class="p-error">{{
                    registerFormErrors.zipcode
                  }}</small>
                </div>
              </div>

              <!-- Étape 4: Résumé et confirmation -->
              <div v-else-if="registrationStep === 3" class="space-y-4">
                <h3 class="text-lg font-medium mb-4">Vérifiez vos informations</h3>

                <div class="grid grid-cols-2 gap-4">
                  <div class="col-span-2 md:col-span-1">
                    <h4 class="font-medium text-primary">Compte</h4>
                    <p><span class="font-medium">Email:</span> {{ registerForm.email }}</p>
                    <p>
                      <span class="font-medium">Nom d'utilisateur:</span>
                      {{ registerForm.username }}
                    </p>
                  </div>

                  <div class="col-span-2 md:col-span-1">
                    <h4 class="font-medium text-primary">Informations personnelles</h4>
                    <p>
                      <span class="font-medium">Nom:</span> {{ registerForm.firstname }}
                      {{ registerForm.lastname }}
                    </p>
                    <p><span class="font-medium">Téléphone:</span> {{ registerForm.phone }}</p>
                  </div>

                  <div class="col-span-2">
                    <h4 class="font-medium text-primary">Adresse</h4>
                    <p>
                      {{ registerForm.address.street }}, {{ registerForm.number }}<br />
                      {{ registerForm.zipcode }} {{ registerForm.address.city }}
                    </p>
                  </div>
                </div>

                <Message severity="info">
                  En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique
                  de confidentialité.
                </Message>
              </div>

              <!-- Boutons de navigation entre les étapes -->
              <div class="flex justify-between mt-6">
                <Button
                  v-if="registrationStep > 0"
                  label="Précédent"
                  icon="pi pi-arrow-left"
                  class="p-button-outlined"
                  @click="goToPreviousStep"
                />
                <div v-else></div>

                <Button
                  v-if="registrationStep < 3"
                  label="Suivant"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  @click="goToNextStep"
                />
                <Button
                  v-else
                  label="S'inscrire"
                  icon="pi pi-check"
                  iconPos="right"
                  @click="handleRegister"
                  :loading="formSubmitting"
                />
              </div>
            </div>
          </TabPanel>
        </TabView>
      </template>
    </Card>
  </div>
</template>
