// --- 1. INITIALISATION ET ÉVÉNEMENTS ---
document.addEventListener('DOMContentLoaded', () => {
    // Écoute des changements sur les champs du formulaire principal
    ['date-in', 'date-out', 'pack-select', 'bungalow'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', updateAll);
    });
    backToMenu();
});

// --- 2. CALCULS ET MISE À JOUR (Temps réel) ---
function updateAll() {
    // Calcul Séjour
    const dIn = document.getElementById('date-in')?.value;
    const dOut = document.getElementById('date-out')?.value;
    let nightPrice = 0;
    if (dIn && dOut) {
        const diff = (new Date(dOut) - new Date(dIn)) / (1000 * 60 * 60 * 24);
        nightPrice = Math.max(0, diff) * 200;
    }
    document.getElementById('night-total').innerText = nightPrice;

    // Calcul Pack
    const packPrice = parseInt(document.getElementById('pack-select')?.value) || 0;
    document.getElementById('pack-total').innerText = packPrice;

    // Calcul Services (Chat)
    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach(item => totalServices += parseFloat(item.value));
    document.getElementById('services-total-display').innerText = totalServices;

    // Total Final
    document.getElementById('display-total-final').innerText = (nightPrice + packPrice + totalServices) + "€";
}

// --- 3. LOGIQUE CHATBOT ---
function toggleChat() {
    const chatBody = document.getElementById('chat-body');
    const icon = document.getElementById('chat-icon');
    chatBody.classList.toggle('open');
    icon.classList.toggle('fa-chevron-up');
    icon.classList.toggle('fa-chevron-down');
}

function backToMenu() {
    document.getElementById('chat-content').innerHTML = `
        <strong>Que puis-je faire pour vous ?</strong>
        <div class="chat-options">
            <button type="button" onclick="showCategory('services')">🛎️ Nos Services</button>
        </div>`;
}

function showCategory(cat) {
    const container = document.getElementById('chat-content');
    container.innerHTML = `
        <button onclick="backToMenu()" style="margin-bottom:10px;">⬅ Retour</button>
        ${renderService("Petit déjeuner", 15)}
        ${renderService("Ménage", 20)}
        ${renderService("Massage Solo", 110)}
        ${renderService("Massage Duo", 180)}
        ${renderService("Charrette Couple", 180)}
        ${renderService("Charrette Famille", 300)}
        ${renderService("Kayak/Paddle Couple", 240)}
        ${renderService("Kayak/Paddle Famille", 400)}
        <div class="service-row">
            <label><input type="checkbox" class="service-item" value="0" onchange="updateAll()"> 🛠 Problème technique</label>
            <input type="datetime-local" class="service-date" style="width:100%;">
            <textarea class="service-desc" placeholder="Détails..." style="width:100%;"></textarea>
        </div>
        <button type="button" onclick="sendServicesRequest()" style="width:100%; background:#28a745; color:white; padding:10px; margin-top:10px; border:none; cursor:pointer;">Envoyer la demande</button>
    `;
}

function renderService(name, price) {
    return `
        <div class="service-row" style="margin-bottom:15px; border-bottom:1px solid #eee;">
            <label><input type="checkbox" class="service-item" value="${price}" onchange="updateAll()"> <strong>${name}</strong> - ${price}€</label><br>
            <input type="datetime-local" class="service-date" style="width:100%;">
        </div>`;
}

// --- 4. ENVOI EMAIL (Corrigé pour capturer toutes les données) ---
function sendServicesRequest() {
    // Récupération des données du formulaire principal
    const dateIn = document.getElementById('date-in')?.value || "Non précisé";
    const dateOut = document.getElementById('date-out')?.value || "Non précisé";
    
    // Récupération des services du chat
    let detailsServices = [];
    document.querySelectorAll('.service-row').forEach(row => {
        const check = row.querySelector('.service-item');
        if (check && check.checked) {
            const date = row.querySelector('.service-date')?.value || "Date non précisée";
            const desc = row.querySelector('.service-desc')?.value || "";
            const name = check.parentElement.innerText.split('-')[0].trim();
            detailsServices.push(`${name} (${date.replace('T', ' à ')}) ${desc}`);
        }
    });

    // Paramètres finaux
    const templateParams = {
        client_name: document.getElementById('client-firstname')?.value + ' ' + document.getElementById('client-lastname')?.value,
        client_email: document.getElementById('email')?.value,
        client_phone: document.getElementById('phone')?.value,
        bungalow: document.getElementById('bungalow')?.value,
        dates: `Du ${dateIn} au ${dateOut}`,
        liste_services: detailsServices.length > 0 ? detailsServices.join(" | ") : "Aucun service",
        total_final: document.getElementById('display-total-final')?.innerText
    };

    emailjs.send("service_8chuqsf", "template_ip31gnr", templateParams)
        .then(() => {
            alert("Demande envoyée avec succès !");
            backToMenu();
        }, (err) => {
            console.error(err);
            alert("Erreur lors de l'envoi.");
        });
}
