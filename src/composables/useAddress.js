// Composable pour formater les adresses
export function useAddress() {
  /**
   * Formate une adresse pour un affichage cohérent
   * @param {Object} address - L'objet adresse à formater
   * @param {string} address.street - La rue
   * @param {string|number} [address.number] - Le numéro (optionnel)
   * @param {string} address.city - La ville
   * @param {string} address.zipcode - Le code postal
   * @param {Object} [options] - Options de formatage
   * @param {boolean} [options.html=false] - Si vrai, utilise des balises <br> pour les sauts de ligne
   * @param {boolean} [options.singleLine=false] - Si vrai, affiche l'adresse sur une seule ligne
   * @returns {string} L'adresse formatée
   */
  const formatAddress = (address, options = {}) => {
    if (!address) return 'Aucune adresse'

    const { street, number, city, zipcode } = address
    const { html = false, singleLine = false } = options

    // Vérifier que les données essentielles sont présentes
    if (!street || (!city && !zipcode)) {
      return 'Adresse incomplète'
    }

    let formattedAddress = ''

    // Format: numéro rue code_postal ville
    // Exemple: "1 rue des fontaines 49370 Le louroux"
    if (number) {
      formattedAddress += number + ' rue '
    }

    if (street) {
      formattedAddress += street
    }

    // Séparateur entre les lignes
    const separator = singleLine ? ' ' : html ? '<br />' : '\n'

    // Deuxième ligne: code postal et ville
    if (zipcode || city) {
      formattedAddress += separator
      if (zipcode) formattedAddress += zipcode
      if (zipcode && city) formattedAddress += ' '
      if (city) formattedAddress += city
    }

    return formattedAddress
  }

  /**
   * Vérifie si une adresse est valide (contient au minimum rue et ville)
   * @param {Object} address - L'objet adresse à vérifier
   * @returns {boolean} Vrai si l'adresse est suffisamment complète
   */
  const isValidAddress = (address) => {
    if (!address) return false
    const { street, city } = address
    return Boolean(street && city)
  }

  return {
    formatAddress,
    isValidAddress,
  }
}
