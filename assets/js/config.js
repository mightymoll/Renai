// Renseigner une destination réelle avant d’activer l’envoi des demandes.
// HUBSPOT : prioritaire si PORTAL_ID et FORM_GUID sont renseignés. Les demandes sont envoyées
//           au formulaire HubSpot correspondant (contacts créés dans le CRM Renai.io).
//           Le formulaire HubSpot doit contenir exactement : firstname, lastname, company, email, message
//           (message non obligatoire).
//           SUBSCRIPTION_TYPE_ID : type d’abonnement de l’email de confirmation. Chaque envoi déclare
//           un intérêt légitime (RGPD) pour ce type, avec le texte affiché sous le bouton (#form-legal).
// HUBSPOT_PARTICULIERS : formulaire HubSpot distinct pour les inscriptions de la page particuliers/
//           (même portail que HUBSPOT). Le formulaire doit contenir : firstname, lastname, email.
//           SUBSCRIPTION_TYPE_ID : type d’abonnement auquel la case à cocher donne le consentement
//           (information sur le lancement). Vide = consentement au traitement uniquement.
//           FORM_GUID vide = inscriptions non envoyées (affichées dans la console).
// CONTACT_ENDPOINT : URL HTTPS acceptant une requête POST JSON.
// CONTACT_EMAIL : adresse destinataire d’une demande préparée dans le logiciel de messagerie.
window.RENAI_CONTACT = {
  HUBSPOT: {
    PORTAL_ID: '149538073',
    FORM_GUID: '91d5a0bd-6fb8-469c-a3e7-7a0c23404860',
    API_HOST: 'https://api.hsforms.com',
    SUBSCRIPTION_TYPE_ID: 3863686359
  },
  HUBSPOT_PARTICULIERS: {
    FORM_GUID: '2c6da6b4-e128-4499-b339-e784de4dc220',
    SUBSCRIPTION_TYPE_ID: 3863652558
  },
  CONTACT_ENDPOINT: '',
  CONTACT_EMAIL: ''
};
