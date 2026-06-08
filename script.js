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
    const nightPrice = 200;
    const dateIn = new Date(document.getElementById('date-in').value);
    const dateOut = new Date(document.getElementById('date-out').value);
    
    // Calcul des nuitées
    const diffTime = Math.abs(dateOut - dateIn);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 0;
    
    // Calcul des packs cochés
    let packTotal = 0;
    const checkboxes = document.querySelectorAll('input[name="pack"]:checked');
    checkboxes.forEach((cb) => {
        packTotal += parseFloat(cb.value);
    });
    
    const totalPrice = (nights * nightPrice) + packTotal;
    document.getElementById('total-price').innerText = totalPrice + " €";
}


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
