import { onMounted } from 'vue';

// Eruda est l'outils qui sert à avoir la console sur tout les navigateurs mobiles

export default function useEruda() {
  if (import.meta.env.VITE_SERVER === 'develop') {
    onMounted(async () => {
      // Charger le script Eruda
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/eruda/eruda.min.js';
      script.onload = () => {
        window.eruda.init();
      };
      document.body.appendChild(script);
    });
  }
}
