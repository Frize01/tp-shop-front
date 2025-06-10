<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'

const visible = ref(false)

function showDialog() {
  visible.value = true
}

function hideDialog() {
  visible.value = false
}
</script>

<template>
  <div>
    <Button label="Tester Dialog" icon="pi pi-external-link" @click="showDialog" />

    <Dialog
      v-model:visible="visible"
      modal
      header="Test Dialog"
      :style="{ width: '50vw' }"
      :draggable="false"
    >
      <p class="m-0">
        Cette boîte de dialogue est un test pour vérifier que le composant Dialog de PrimeVue
        fonctionne correctement.
      </p>
      <template #footer>
        <Button label="Fermer" icon="pi pi-times" @click="hideDialog" text />
      </template>
    </Dialog>
  </div>
</template>
