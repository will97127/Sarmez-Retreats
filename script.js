// Fonction pour ouvrir ou fermer le widget d'assistance de conciergerie
function toggleChat() {
const chatBody = document.getElementById('chat-body');
const icon = document.getElementById('chat-icon');

chatBody.classList.toggle('open');

if(chatBody.classList.contains('open')) {
icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
} else {
icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
}
}

// Logique de réponse automatique basée sur les règles de gestion du gîte
function botAnswer(actionKey) {
const responseDiv = document.getElementById('chat-response');
responseDiv.classList.remove('hidden');

let answerText = "";

switch(actionKey) {
case 'contrat':
answerText = "📝 <strong>Édition automatique :</strong> Dès que vous cliquez sur vos dates et validez votre demande sur notre planning, notre système génère votre contrat de location. Vous recevrez un lien par email/SMS pour y apposer votre <strong>signature électronique sécurisée</strong>.";
break;
case 'solde':
answerText = "💳 <strong>Suivi de votre dossier :</strong> Vous disposez d'une fiche client en ligne dédiée. Notre copilote vous enverra un rappel automatique avant l'échéance pour régler vos acomptes, suppléments ou votre solde en toute simplicité.";
break;
case 'synchro':
answerText = "🔄 <strong>Synchronisation OTA :</strong> Oui ! Que vous réserviez directement ici, par téléphone, ou via Airbnb/Booking, les calendriers se mettent à jour automatiquement à la minute près. Le surbooking est techniquement impossible.";
break;
default:
answerText = "🤖 Notre copilote centralise toutes les requêtes. Un gestionnaire humain prendra le relais si nécessaire.";
}

responseDiv.innerHTML = answerText;

// Fait défiler le chat vers le bas pour afficher la réponse
const chatBody = document.getElementById('chat-body');
chatBody.scrollTop = chatBody.scrollHeight;
}
