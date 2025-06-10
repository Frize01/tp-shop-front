<script setup>
import { ref } from 'vue'

// Avantages client améliorés
const features = ref([
  {
    title: 'Livraison gratuite',
    description: 'Livraison offerte pour toute commande supérieure à 100€',
    icon: 'pi pi-truck',
    color: 'bg-blue-50 text-blue-600',
    iconClass: 'bg-blue-100',
  },
  {
    title: 'Paiement sécurisé',
    description: 'Vos paiements sont protégés par un cryptage et pas un chiffrement de pointe',
    icon: 'pi pi-lock',
    color: 'bg-green-50 text-green-600',
    iconClass: 'bg-green-100',
  },
  {
    title: "Pas d'assistance",
    description: 'Notre équipe est indisponible à tout moment pour vous aider',
    icon: 'pi pi-comments',
    color: 'bg-purple-50 text-purple-600',
    iconClass: 'bg-purple-100',
  },
  {
    title: 'Retours difficiles',
    description:
      'Retournez vos produits sous 30 jours avant receptions du colis sans justification',
    icon: 'pi pi-replay',
    color: 'bg-orange-50 text-orange-600',
    iconClass: 'bg-orange-100',
  },
])
</script>

<template>
  <div class="py-12 bg-gray-50 rounded-xl shadow-sm mb-12">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-12">Nos engagements</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(feature, index) in features"
          :key="index"
          :class="[feature.color, 'rounded-lg p-6 transition-transform hover:scale-105 shadow-sm']"
        >
          <div class="flex items-center mb-4">
            <div
              :class="[
                feature.iconClass,
                'w-12 h-12 rounded-full flex items-center justify-center',
              ]"
            >
              <i :class="[feature.icon, 'text-xl']"></i>
            </div>
            <h3 class="font-bold text-xl ml-4">{{ feature.title }}</h3>
          </div>
          <p class="text-gray-700">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
