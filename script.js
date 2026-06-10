// --- FONCTION DE CALCUL UNIFIÉE ---
function updateAll() {
    // 1. Calcul Séjour (200€/nuit)
    const d1 = new Date(document.getElementById('date-in').value);
    const d2 = new Date(document.getElementById('date-out').value);
    const nights = Math.max(0, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)));
    const nightPrice = nights * 200;

    // 2. Calcul Pack
    const packSelect = document.getElementById('pack-select');
    const packPrice = parseInt(packSelect.value) || 0;

    // 3. Calcul Services (Conciergerie)
    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach((item) => {
        totalServices += parseFloat(item.value);
    });

    // 4. Mise à jour de l'affichage dans le chat
    const servTotalEl = document.getElementById('services-total');
    if(servTotalEl) servTotalEl.innerText = totalServices + "€";

    // 5. Mise à jour de la barre flottante (id="final-total" dans votre HTML)
    document.getElementById('night-total').innerText = nightPrice;
    document.getElementById('pack-total').innerText = packPrice;
    
    const grandTotal = nightPrice + packPrice + totalServices;
    document.getElementById('final-total').innerText = grandTotal;
    
    // Mise à jour texte formulaire
    document.getElementById('total-price').innerText = grandTotal + " €";
}

// --- INITIALISATION DES ÉCOUTEURS ---
// Dates et Pack
['date-in', 'date-out', 'pack-select'].forEach(id => {
    document.getElementById(id).addEventListener('change', updateAll);
});

// Checkboxes de services
document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('change', updateAll);
});

// --- LOGIQUE CHATBOT ---
function toggleChat() {
    document.getElementById('chat-body').classList.toggle('open');
}

function showCategory(cat) {
    const container = document.getElementById('chat-content');
    const data = {
        'services': `<strong>Nos Services :</strong><br>
            <div id="services-form">
                <label><input type="checkbox" class="service-item" value="15" onchange="updateAll()"> Petit déjeuner : 15€</label><br>
                <label><input type="checkbox" class="service-item" value="20" onchange="updateAll()"> Ménage : 20€</label><br>
                <label><input type="checkbox" class="service-item" value="100" onchange="updateAll()"> Massage Solo : 100€</label><br>
                <hr>
                <p>Total services : <strong id="services-total">0€</strong></p>
                <button onclick="sendServicesRequest()">Envoyer demande</button>
                <button onclick="backToMenu()">Retour</button>
            </div>`,
        'plages': `<strong>Plages :</strong><br>• <a href="https://www.google.com/maps/search/Plage+du+Souffleur" target="_blank">Plage du Souffleur</a><br><button onclick="backToMenu()">⬅ Retour</button>`
    };
    container.innerHTML = `<div class="message bot">${data[cat] || 'En construction'}</div>`;
}

function backToMenu() {
    document.getElementById('chat-content').innerHTML = `
        <div class="message bot">Que puis-je faire pour vous ?</div>
        <div class="chat-options">
            <button onclick="showCategory('services')">🛎️ Services</button>
            <button onclick="showCategory('plages')">🏖️ Plages</button>
        </div>`;
}

function sendServicesRequest() {
    alert("Votre sélection de services a été prise en compte pour votre séjour.");
}
