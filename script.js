// --- LOGIQUE DE CALCUL DU PRIX (Formulaire & Barre flottante) ---
function calculate() {
    // 1. Calcul des nuitées
    const dateIn = new Date(document.getElementById('date-in').value);
    const dateOut = new Date(document.getElementById('date-out').value);
    const diffTime = Math.abs(dateOut - dateIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const nights = (diffDays && diffDays > 0) ? diffDays : 0;
    const nightPrice = nights * 200;

    // 2. Calcul du pack
    const packSelect = document.getElementById('pack-select');
    const selectedOption = packSelect.options[packSelect.selectedIndex];
    const packPrice = parseInt(selectedOption.value) || 0;
    const packName = selectedOption.dataset.name || "Aucun";

    // 3. Règle "Pack Signature"
    if (packName.includes("Signature") && nights < 7) {
        alert("Attention : Le Pack Signature nécessite un séjour minimum de 7 nuits.");
    }

    // 4. Mise à jour de la barre flottante
    document.getElementById('night-total').innerText = nightPrice;
    document.getElementById('pack-total').innerText = packPrice;
    document.getElementById('final-price').innerText = nightPrice + packPrice;
    
    // Mise à jour formulaire
    document.getElementById('total-price').innerText = (nightPrice + packPrice) + " €";
}

// Initialisation des écouteurs pour le calcul
['bungalow', 'date-in', 'date-out', 'pack-select'].forEach(id => {
    document.getElementById(id).addEventListener('change', calculate);
});

// --- LOGIQUE DU CHATBOT (Conciergerie) ---
function toggleChat() {
    const chatBody = document.getElementById('chat-body');
    const icon = document.getElementById('chat-icon');
    chatBody.classList.toggle('open');
    icon.classList.replace(chatBody.classList.contains('open') ? 'fa-chevron-up' : 'fa-chevron-down', 
                           chatBody.classList.contains('open') ? 'fa-chevron-down' : 'fa-chevron-up');
}

function showCategory(cat) {
    const container = document.getElementById('chat-content');
    const data = {
        'services': `<strong>Nos Services :</strong><br>• Petit déjeuner : 15€<br>• Ménage : 20€<br>• Traiteur : Sur devis<br>• Massage Solo : 100€ / Duo : 170€<br>• Charrette : Couple 160€ / Famille 280€<br>• Kayak/Paddle : Couple 220€ / Famille 380€<br><button onclick="backToMenu()">⬅ Retour</button>`,
        'plages': `<strong>Plages :</strong><br>• <a href="https://www.google.com/maps/search/Plage+du+Souffleur" target="_blank">Plage du Souffleur</a><br>• <a href="https://www.google.com/maps/search/Plage+de+la+Chapelle" target="_blank">Plage de la Chapelle</a><br><button onclick="backToMenu()">⬅ Retour</button>`,
        'restos': `<strong>Restaurant :</strong><br>• <a href="https://www.google.com/maps/search/Chez+Pinpin+Petit-Canal" target="_blank">Chez Pinpin</a><br><button onclick="backToMenu()">⬅ Retour</button>`,
        'culture': `<strong>Lieux culturels :</strong><br>• <a href="https://www.google.com/maps/search/Marches+des+Esclaves" target="_blank">Marche des Esclaves</a><br>• <a href="https://www.google.com/maps/search/Site+de+Duval" target="_blank">Site de Duval</a><br>• <a href="https://www.google.com/maps/search/Port+de+peche+Petit-Canal" target="_blank">Port de pêche</a><br><button onclick="backToMenu()">⬅ Retour</button>`
    };
    container.innerHTML = `<div class="message bot">${data[cat]}</div>`;
}

function backToMenu() {
    document.getElementById('chat-content').innerHTML = `
        <div class="message bot">Que puis-je faire pour vous ?</div>
        <div class="chat-options">
            <button onclick="showCategory('services')">🛎️ Services</button>
            <button onclick="showCategory('plages')">🏖️ Plages</button>
            <button onclick="showCategory('restos')">🍽️ Restaurant</button>
            <button onclick="showCategory('culture')">🏛️ Culture</button>
        </div>`;
}

// --- SOUMISSION FORMULAIRE ---
document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    alert("Merci ! Votre demande a bien été enregistrée. Nous vous recontactons très vite.");
});
// Écouteur global pour les cases à cocher des services
document.getElementById('services-form').addEventListener('change', function() {
    let totalServices = 0;
    const checkboxes = document.querySelectorAll('#services-form input[type="checkbox"]:checked');
    
    checkboxes.forEach((cb) => {
        totalServices += parseInt(cb.value);
    });

    // Mise à jour de l'affichage dans le chat
    document.getElementById('services-total').innerText = totalServices + "€";
    
    // Si vous voulez aussi ajouter ce montant au total général de la barre en bas :
    // updateGlobalTotal(totalServices); 
});

function sendServicesRequest() {
    const selected = [];
    document.querySelectorAll('#services-form input[type="checkbox"]:checked').forEach((cb) => {
        selected.push(cb.dataset.name);
    });
    
    alert("Demande envoyée pour : " + selected.join(', '));
}
