<script setup>
import Panel from 'primevue/panel'
import { useAddress } from '@/composables/useAddress'

const props = defineProps({
  address: {
    type: Object,
    required: true,
  },
})

const { formatAddress, isValidAddress } = useAddress()
</script>

<template>
  <Panel header="Adresse de livraison" v-if="address && isValidAddress(address)">
    <div class="p-2">
      <p v-html="formatAddress(address, { html: true })"></p>
      <div v-if="address.geolocation" class="text-sm text-gray-500 mt-2">
        <p>Coordonnées: {{ address.geolocation.lat }}, {{ address.geolocation.long }}</p>
      </div>
    </div>
  </Panel>
  <Panel header="Adresse de livraison" v-else-if="address">
    <div class="p-2">
      <p class="text-gray-500">Adresse incomplète</p>
    </div>
  </Panel>
  <Panel header="Adresse de livraison" v-else>
    <div class="p-2">
      <p class="text-gray-500">Aucune adresse enregistrée</p>
    </div>
  </Panel>
</template>
