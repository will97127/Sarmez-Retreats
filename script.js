// --- FONCTION DE CALCUL UNIFIÉE ---
function updateAll() {
    // 1. Calcul Séjour (Base 200€/nuit)
    const dateIn = new Date(document.getElementById('date-in').value);
    const dateOut = new Date(document.getElementById('date-out').value);
    const diffTime = Math.abs(dateOut - dateIn);
    const nights = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const nightPrice = nights * 200;

    // 2. Calcul Pack
    const packSelect = document.getElementById('pack-select');
    const packPrice = parseInt(packSelect.value) || 0;

    // 3. Calcul Services (Conciergerie)
    let totalServices = 0;
    // On utilise document.body pour détecter les checkbox même si elles sont ajoutées dynamiquement
    document.querySelectorAll('.service-item:checked').forEach((item) => {
        totalServices += parseFloat(item.value);
    });

    // 4. Mise à jour de l'affichage
    const servTotalEl = document.getElementById('services-total');
    if (servTotalEl) servTotalEl.innerText = totalServices + "€";

    document.getElementById('night-total').innerText = nightPrice;
    document.getElementById('pack-total').innerText = packPrice;
    
    const grandTotal = nightPrice + packPrice + totalServices;
    document.getElementById('display-total-final').innerText = grandTotal + "€";
}

// --- INITIALISATION DES ÉCOUTEURS ---
// Dates et Pack
['date-in', 'date-out', 'pack-select'].forEach(id => {
    document.getElementById(id).addEventListener('change', updateAll);
});

// Écouteur global pour les services (délégation d'événement)
document.addEventListener('change', function(e) {
    if (e.target.classList.contains('service-item')) {
        updateAll();
    }
});

// --- LOGIQUE CHATBOT ---
function toggleChat() {
    const chatBody = document.getElementById('chat-body');
    const icon = document.getElementById('chat-icon');
    chatBody.classList.toggle('open');
    icon.classList.toggle('fa-chevron-up');
    icon.classList.toggle('fa-chevron-down');
}

function showCategory(cat) {
    const container = document.getElementById('chat-content');
    const data = {
        'services': `<strong>Sélectionnez vos services :</strong><br>
            <label><input type="checkbox" class="service-item" value="15"> Petit déjeuner : 15€</label><br>
            <label><input type="checkbox" class="service-item" value="20"> Ménage : 20€</label><br>
            <label><input type="checkbox" class="service-item" value="110"> Massage Solo : 110€</label><br>
            <label><input type="checkbox" class="service-item" value="180"> Massage Duo : 180€</label><br>
            <label><input type="checkbox" class="service-item" value="180"> Charrette Couple : 180€</label><br>
            <label><input type="checkbox" class="service-item" value="300"> Charrette Famille : 300€</label><br>
            <label><input type="checkbox" class="service-item" value="240"> Kayak/Paddle Couple : 240€</label><br>
            <label><input type="checkbox" class="service-item" value="400"> Kayak/Paddle Famille : 400€</label><br>
            <hr><p>Total services : <strong id="services-total">0€</strong></p>
            <button onclick="backToMenu()">⬅ Retour</button>`
    };
    container.innerHTML = data[cat] || "Catégorie non trouvée.";
}

function backToMenu() {
    document.getElementById('chat-content').innerHTML = `
        <strong>Que puis-je faire pour vous ?</strong>
        <div class="chat-options">
            <button onclick="showCategory('services')">🛎️ Nos Services</button>
        </div>`;
}

// Soumission formulaire
document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    alert("Merci ! Votre demande est enregistrée pour un total de : " + document.getElementById('display-total-final').innerText);
});
