<script setup>
import Panel from 'primevue/panel'

const props = defineProps({
  address: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <Panel header="Adresse de livraison" v-if="address">
    <div class="p-2">
      <p class="mb-2">
        {{ address.street }}
        <span v-if="address.number">, n° {{ address.number }}</span>
      </p>
      <p class="mb-2">{{ address.zipcode }} {{ address.city }}</p>
      <div v-if="address.geolocation" class="text-sm text-gray-500 mt-2">
        <p>Coordonnées: {{ address.geolocation.lat }}, {{ address.geolocation.long }}</p>
      </div>
    </div>
  </Panel>
</template>
