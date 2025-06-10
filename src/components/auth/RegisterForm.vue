<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { useAddress } from '@/composables/useAddress'

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
  'register-success',
  'register-error',
  'update:formSubmitting',
  'update:formError',
])

const router = useRouter()
const authStore = useAuthStore()
const registrationStep = ref(0)
const { formatAddress } = useAddress()

// Étapes du formulaire d'inscription
const registrationSteps = [
  { label: 'Informations de compte', icon: 'pi pi-user' },
  { label: 'Informations personnelles', icon: 'pi pi-id-card' },
  { label: 'Adresse', icon: 'pi pi-home' },
  { label: 'Confirmation', icon: 'pi pi-check' },
]

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

// Validation des champs du formulaire
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

// Valide l'étape actuelle du formulaire d'inscription
function validateCurrentStep() {
  let isValid = true

  // Réinitialisation des erreurs pour cette étape
  if (registrationStep.value === 0) {
    // Étape 1: Validation des informations de compte
    registerFormErrors.email = ''
    registerFormErrors.username = ''
    registerFormErrors.password = ''
    registerFormErrors.passwordConfirm = ''

    // Validation de l'email
    if (!registerForm.email.trim()) {
      registerFormErrors.email = 'Email requis'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerForm.email)) {
      registerFormErrors.email = 'Format email invalide'
      isValid = false
    }

    // Validation du nom d'utilisateur
    if (!registerForm.username.trim()) {
      registerFormErrors.username = "Nom d'utilisateur requis"
      isValid = false
    } else if (registerForm.username.length < 3) {
      registerFormErrors.username = "Le nom d'utilisateur doit contenir au moins 3 caractères"
      isValid = false
    }

    // Validation du mot de passe
    if (!registerForm.password) {
      registerFormErrors.password = 'Mot de passe requis'
      isValid = false
    } else if (registerForm.password.length < 6) {
      registerFormErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
      isValid = false
    }

    // Validation de la confirmation du mot de passe
    if (registerForm.password !== registerForm.passwordConfirm) {
      registerFormErrors.passwordConfirm = 'Les mots de passe ne correspondent pas'
      isValid = false
    }
  } else if (registrationStep.value === 1) {
    // Étape 2: Validation des informations personnelles
    registerFormErrors.firstname = ''
    registerFormErrors.lastname = ''
    registerFormErrors.phone = ''

    // Validation du prénom
    if (!registerForm.firstname.trim()) {
      registerFormErrors.firstname = 'Prénom requis'
      isValid = false
    }

    // Validation du nom
    if (!registerForm.lastname.trim()) {
      registerFormErrors.lastname = 'Nom requis'
      isValid = false
    }

    // Validation du téléphone (optionnel)
    if (registerForm.phone && !/^\+?[0-9\s-]{8,15}$/.test(registerForm.phone)) {
      registerFormErrors.phone = 'Format de téléphone invalide'
      isValid = false
    }
  } else if (registrationStep.value === 2) {
    // Étape 3: Validation de l'adresse
    registerFormErrors.street = ''
    registerFormErrors.city = ''
    registerFormErrors.number = ''
    registerFormErrors.zipcode = ''

    // Validation de la rue
    if (!registerForm.address.street.trim()) {
      registerFormErrors.street = 'Rue requise'
      isValid = false
    }

    // Validation de la ville
    if (!registerForm.address.city.trim()) {
      registerFormErrors.city = 'Ville requise'
      isValid = false
    }

    // Validation du numéro (optionnel)
    if (registerForm.number && !/^[0-9]+[a-zA-Z]?$/.test(registerForm.number)) {
      registerFormErrors.number = 'Format de numéro invalide'
      isValid = false
    }

    // Validation du code postal
    if (!registerForm.zipcode.trim()) {
      registerFormErrors.zipcode = 'Code postal requis'
      isValid = false
    }
  }

  return isValid
}

// Navigation dans le formulaire d'inscription
function nextStep() {
  if (validateCurrentStep()) {
    if (registrationStep.value < registrationSteps.length - 1) {
      registrationStep.value++
    }
  }
}

function prevStep() {
  if (registrationStep.value > 0) {
    registrationStep.value--
  }
}

// Soumission du formulaire d'inscription
async function handleRegister() {
  emit('update:formSubmitting', true)
  emit('update:formError', '')

  try {
    await authStore.register({
      email: registerForm.email,
      username: registerForm.username,
      password: registerForm.password,
      name: {
        firstname: registerForm.firstname,
        lastname: registerForm.lastname,
      },
      address: {
        city: registerForm.address.city,
        street: registerForm.address.street,
        number: registerForm.number,
        zipcode: registerForm.zipcode,
        geolocation: {
          lat: registerForm.address.geolocation.lat || '0',
          long: registerForm.address.geolocation.long || '0',
        },
      },
      phone: registerForm.phone,
    })

    // Redirection vers la page de connexion après inscription réussie
    router.push('/')
    emit('register-success')
  } catch (error) {
    emit('update:formError', "Échec de l'inscription. Veuillez réessayer.")
    emit('register-error', error)
  } finally {
    emit('update:formSubmitting', false)
  }
}
</script>

<template>
  <div>
    <!-- Formulaire d'inscription - Étape 1: Informations de compte -->
    <div v-if="registrationStep === 0" class="space-y-4">
      <div class="field">
        <label for="email" class="block mb-1">Email</label>
        <InputText
          id="email"
          v-model="registerForm.email"
          class="w-full"
          :class="{ 'p-invalid': registerFormErrors.email }"
        />
        <small class="text-red-500" v-if="registerFormErrors.email">
          {{ registerFormErrors.email }}
        </small>
      </div>

      <div class="field">
        <label for="register-username" class="block mb-1">Nom d'utilisateur</label>
        <InputText
          id="register-username"
          v-model="registerForm.username"
          class="w-full"
          :class="{ 'p-invalid': registerFormErrors.username }"
        />
        <small class="text-red-500" v-if="registerFormErrors.username">
          {{ registerFormErrors.username }}
        </small>
      </div>

      <div class="field">
        <label for="register-password" class="block mb-1">Mot de passe</label>
        <Password
          id="register-password"
          v-model="registerForm.password"
          toggleMask
          class="w-full"
          :class="{ 'p-invalid': registerFormErrors.password }"
        />
        <small class="text-red-500" v-if="registerFormErrors.password">
          {{ registerFormErrors.password }}
        </small>
      </div>

      <div class="field">
        <label for="password-confirm" class="block mb-1">Confirmer le mot de passe</label>
        <Password
          id="password-confirm"
          v-model="registerForm.passwordConfirm"
          toggleMask
          class="w-full"
          :feedback="false"
          :class="{ 'p-invalid': registerFormErrors.passwordConfirm }"
        />
        <small class="text-red-500" v-if="registerFormErrors.passwordConfirm">
          {{ registerFormErrors.passwordConfirm }}
        </small>
      </div>

      <div class="flex justify-end">
        <Button label="Suivant" icon="pi pi-arrow-right" iconPos="right" @click="nextStep" />
      </div>
    </div>

    <!-- Formulaire d'inscription - Étape 2: Informations personnelles -->
    <div v-else-if="registrationStep === 1" class="space-y-4">
      <div class="field">
        <label for="firstname" class="block mb-1">Prénom</label>
        <InputText
          id="firstname"
          v-model="registerForm.firstname"
          class="w-full"
          :class="{ 'p-invalid': registerFormErrors.firstname }"
        />
        <small class="text-red-500" v-if="registerFormErrors.firstname">
          {{ registerFormErrors.firstname }}
        </small>
      </div>

      <div class="field">
        <label for="lastname" class="block mb-1">Nom</label>
        <InputText
          id="lastname"
          v-model="registerForm.lastname"
          class="w-full"
          :class="{ 'p-invalid': registerFormErrors.lastname }"
        />
        <small class="text-red-500" v-if="registerFormErrors.lastname">
          {{ registerFormErrors.lastname }}
        </small>
      </div>

      <div class="field">
        <label for="phone" class="block mb-1">Téléphone (optionnel)</label>
        <InputText
          id="phone"
          v-model="registerForm.phone"
          class="w-full"
          :class="{ 'p-invalid': registerFormErrors.phone }"
        />
        <small class="text-red-500" v-if="registerFormErrors.phone">
          {{ registerFormErrors.phone }}
        </small>
      </div>

      <div class="flex justify-between">
        <Button label="Précédent" icon="pi pi-arrow-left" @click="prevStep" />
        <Button label="Suivant" icon="pi pi-arrow-right" iconPos="right" @click="nextStep" />
      </div>
    </div>

    <!-- Formulaire d'inscription - Étape 3: Adresse -->
    <div v-else-if="registrationStep === 2" class="space-y-4">
      <div class="field">
        <label for="street" class="block mb-1">Rue</label>
        <InputText
          id="street"
          v-model="registerForm.address.street"
          class="w-full"
          :class="{ 'p-invalid': registerFormErrors.street }"
        />
        <small class="text-red-500" v-if="registerFormErrors.street">
          {{ registerFormErrors.street }}
        </small>
      </div>

      <div class="field">
        <label for="number" class="block mb-1">Numéro (optionnel)</label>
        <InputText
          id="number"
          v-model="registerForm.number"
          class="w-full"
          :class="{ 'p-invalid': registerFormErrors.number }"
        />
        <small class="text-red-500" v-if="registerFormErrors.number">
          {{ registerFormErrors.number }}
        </small>
      </div>

      <div class="field">
        <label for="city" class="block mb-1">Ville</label>
        <InputText
          id="city"
          v-model="registerForm.address.city"
          class="w-full"
          :class="{ 'p-invalid': registerFormErrors.city }"
        />
        <small class="text-red-500" v-if="registerFormErrors.city">
          {{ registerFormErrors.city }}
        </small>
      </div>

      <div class="field">
        <label for="zipcode" class="block mb-1">Code postal</label>
        <InputText
          id="zipcode"
          v-model="registerForm.zipcode"
          class="w-full"
          :class="{ 'p-invalid': registerFormErrors.zipcode }"
        />
        <small class="text-red-500" v-if="registerFormErrors.zipcode">
          {{ registerFormErrors.zipcode }}
        </small>
      </div>

      <div class="flex justify-between">
        <Button label="Précédent" icon="pi pi-arrow-left" @click="prevStep" />
        <Button label="Suivant" icon="pi pi-arrow-right" iconPos="right" @click="nextStep" />
      </div>
    </div>

    <!-- Formulaire d'inscription - Étape 4: Confirmation -->
    <div v-else-if="registrationStep === 3" class="space-y-4">
      <h3 class="text-lg font-medium mb-4">Vérifiez vos informations</h3>

      <div class="bg-gray-50 p-4 rounded">
        <h4 class="font-medium mb-2">Informations de compte</h4>
        <p><strong>Email:</strong> {{ registerForm.email }}</p>
        <p><strong>Nom d'utilisateur:</strong> {{ registerForm.username }}</p>
      </div>

      <div class="bg-gray-50 p-4 rounded">
        <h4 class="font-medium mb-2">Informations personnelles</h4>
        <p><strong>Prénom:</strong> {{ registerForm.firstname }}</p>
        <p><strong>Nom:</strong> {{ registerForm.lastname }}</p>
        <p><strong>Téléphone:</strong> {{ registerForm.phone || 'Non renseigné' }}</p>
      </div>

      <div class="bg-gray-50 p-4 rounded">
        <h4 class="font-medium mb-2">Adresse</h4>
        <p>
          {{
            formatAddress({
              street: registerForm.address.street,
              number: registerForm.number,
              city: registerForm.address.city,
              zipcode: registerForm.zipcode,
            })
          }}
        </p>
      </div>

      <Message
        v-if="props.formError"
        severity="error"
        :text="props.formError"
        class="w-full mt-3"
      />

      <div class="flex justify-between pt-4">
        <Button label="Précédent" icon="pi pi-arrow-left" @click="prevStep" />
        <Button
          type="submit"
          label="S'inscrire"
          icon="pi pi-check"
          @click="handleRegister"
          :loading="props.formSubmitting"
        />
      </div>
    </div>
  </div>
</template>
