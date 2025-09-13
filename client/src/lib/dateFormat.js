/**
 * Formate une date dans différentes langues avec options
 * @param {string|Date} date - La date à formater
 * @param {string} locale - La langue à utiliser (ex: 'fr-FR', 'en-US', 'es-ES')
 * @param {Object} options - Options de formatage Intl.DateTimeFormat
 * @returns {string} - Date formatée
 */
export const dateFormat = (
  date,
  locale = navigator.language, // utilise la langue du navigateur par défaut
  options = {}
) => {
  return new Date(date).toLocaleDateString(locale, {
    weekday: "short",   // lun, mar, mer
    year: "numeric",    // 2025
    month: "long",      // janvier
    day: "numeric",     // 8
    hour: "2-digit",    // 09
    minute: "2-digit",  // 05
    ...options,         // possibilité de surcharger
  });
};
