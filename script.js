function toggleChat() {
    const chatBody = document.getElementById('chat-body');
    const icon = document.getElementById('chat-icon');
    chatBody.classList.toggle('open');
    icon.classList.replace(chatBody.classList.contains('open') ? 'fa-chevron-up' : 'fa-chevron-down', 
                           chatBody.classList.contains('open') ? 'fa-chevron-down' : 'fa-chevron-up');
}

function botAnswer(actionKey) {
    const responseDiv = document.getElementById('chat-response');
    responseDiv.classList.remove('hidden');

    const answers = {
        'services': "🛎️ <strong>Nos services :</strong><br>• Petit déjeuner<br>• Ménage<br>• Balade charrette à bœufs<br>• Paddle/Kayak (Mangrove)<br>• Support technique",
        'restaurant': '🍽️ Restaurant : <a href="https://www.google.com/maps/search/Chez+Pinpin+Petit-Canal" target="_blank" style="color:var(--primary);">Chez Pinpin (Itinéraire)</a>',
        'culture': "🏛️ <strong>Sites culturels :</strong><br>• Marche des Esclaves<br>• Port de pêche<br>• Site de Duval",
        'plage': '🏖️ <strong>Plages :</strong><br>• <a href="https://www.google.com/maps/search/Plage+du+Souffleur" target="_blank">Plage du Souffleur</a><br>• <a href="https://www.google.com/maps/search/Plage+de+la+Chapelle" target="_blank">Plage de la Chapelle</a>',
        'contrat': "📝 Votre contrat est généré automatiquement dès validation du planning. Consultez votre espace client."
    };

    responseDiv.innerHTML = answers[actionKey] || "Je suis à votre disposition.";
    const chatBody = document.getElementById('chat-body');
    chatBody.scrollTop = chatBody.scrollHeight;
}
function updatePrice() {
    const packPrice = document.getElementById('pack-selection').value;
    const priceDisplay = document.getElementById('total-price');
    
    // Ici, tu pourrais ajouter une logique complexe (nuitées * prix nuitée + pack)
    // Pour l'instant, on affiche le prix du pack sélectionné
    priceDisplay.innerText = packPrice + " € (hors nuitées)";
}
// --- LOGIQUE DU FORMULAIRE DE RÉSERVATION ---

// 1. Fonction pour mettre à jour le prix estimé
function updatePrice() {
    const packSelect = document.getElementById('pack');
    const priceDisplay = document.getElementById('total-price');
    const selectedPrice = packSelect.value;
    
    // Met à jour l'affichage du prix dans le formulaire
    priceDisplay.innerText = selectedPrice + " € (hors prix des nuitées)";
}

// 2. Écouteur pour capturer l'envoi du formulaire
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Empêche le rechargement de la page
        
        // Récupération des données
        const formData = {
            bungalow: document.getElementById('bungalow').value,
            dateIn: document.getElementById('date-in').value,
            dateOut: document.getElementById('date-out').value,
            pack: document.getElementById('pack').options[document.getElementById('pack').selectedIndex].text,
            email: document.getElementById('email').value
        };

        console.log("Données envoyées :", formData);
        
        // Simulation d'envoi (Ici tu mettras plus tard ton fetch vers Resend)
        alert("Merci " + formData.email + " ! Votre demande pour le " + formData.bungalow + " a bien été enregistrée.");
    });
}
