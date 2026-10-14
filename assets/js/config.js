// Renseigner une destination réelle avant d’activer l’envoi des demandes.
// HUBSPOT : prioritaire si PORTAL_ID et FORM_GUID sont renseignés. Les demandes sont envoyées
//           au formulaire HubSpot correspondant (contacts créés dans le CRM Renai.io).
//           Le formulaire HubSpot doit contenir exactement : firstname, lastname, company, email, message
//           (message non obligatoire).
//           SUBSCRIPTION_TYPE_ID : type d’abonnement de l’email de confirmation. Chaque envoi déclare
//           un intérêt légitime (RGPD) pour ce type, avec le texte affiché sous le bouton (#form-legal).
// CONTACT_ENDPOINT : URL HTTPS acceptant une requête POST JSON.
// CONTACT_EMAIL : adresse destinataire d’une demande préparée dans le logiciel de messagerie.
window.RENAI_CONTACT = {
  HUBSPOT: {
    PORTAL_ID: '149538073',
    FORM_GUID: '91d5a0bd-6fb8-469c-a3e7-7a0c23404860',
    API_HOST: 'https://api.hsforms.com',
    SUBSCRIPTION_TYPE_ID: 3863686359
  },
  CONTACT_ENDPOINT: '',
  CONTACT_EMAIL: ''
};
