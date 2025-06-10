<script setup>
import { computed } from 'vue'
import Avatar from 'primevue/avatar'
import Panel from 'primevue/panel'

const props = defineProps({
  userProfile: {
    type: Object,
    required: true,
  },
})

// Initiales de l'utilisateur pour l'avatar
const userInitials = computed(() => {
  if (!props.userProfile) return '?'

  const firstname = props.userProfile.fullName.split(' ')[0] || ''
  const lastname = props.userProfile.fullName.split(' ')[1] || ''

  return (firstname.charAt(0) + lastname.charAt(0)).toUpperCase()
})
</script>

<template>
  <Panel header="Informations personnelles">
    <div class="flex items-start">
      <Avatar
        :label="userInitials"
        class="mr-4 bg-primary text-white"
        shape="circle"
        size="xlarge"
      />
      <div>
        <h2 class="text-xl font-semibold mb-2">{{ userProfile.fullName }}</h2>
        <p class="text-gray-600 mb-1"><i class="pi pi-user mr-2"></i>{{ userProfile.username }}</p>
        <p class="text-gray-600 mb-1"><i class="pi pi-envelope mr-2"></i>{{ userProfile.email }}</p>
        <p class="text-gray-600 mb-1" v-if="userProfile.phone">
          <i class="pi pi-phone mr-2"></i>{{ userProfile.phone }}
        </p>
      </div>
    </div>
  </Panel>
</template>
