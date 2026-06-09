// --- LOGIQUE DU CHATBOT (Conciergerie) ---
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
    if(chatBody) chatBody.scrollTop = chatBody.scrollHeight;
}

// --- LOGIQUE DU FORMULAIRE DE RÉSERVATION ---

// Fonction unique pour mettre à jour le prix
function updatePrice() {
    const packSelect = document.getElementById('pack');
    const priceDisplay = document.getElementById('total-price');
    priceDisplay.innerText = packSelect.value + " €";
}

document.getElementById('booking-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const data = {
        bungalow: document.getElementById('bungalow').value,
        dateIn: document.getElementById('date-in').value,
        dateOut: document.getElementById('date-out').value,
        pack: document.getElementById('pack').options[document.getElementById('pack').selectedIndex].text,
        email: document.getElementById('email').value
    };

    // Envoi vers votre Worker Cloudflare
    const response = await fetch('https://votre-worker.votre-domaine.workers.dev', {
        method: 'POST',
        body: JSON.stringify(data)
    });

    if (response.ok) alert("Demande envoyée !");
});


// Écouteur pour capturer l'envoi du formulaire
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const formData = {
            bungalow: document.getElementById('bungalow').value,
            dateIn: document.getElementById('date-in').value,
            dateOut: document.getElementById('date-out').value,
            pack: document.getElementById('pack').options[document.getElementById('pack').selectedIndex].text,
            email: document.getElementById('email').value
        };

        console.log("Données envoyées :", formData);
        
        // Alerte de confirmation
        alert("Merci ! Votre demande pour le " + formData.bungalow + " a bien été enregistrée. Nous vous recontactons très vite.");
    });
}
