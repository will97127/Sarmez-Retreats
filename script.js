// --- 1. INITIALISATION ET ÉVÉNEMENTS ---
document.addEventListener('DOMContentLoaded', () => {
    // Écoute des changements sur les champs du formulaire principal pour le calcul en temps réel
    const inputs = ['date-in', 'date-out', 'pack-select', 'bungalow'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updateAll);
    });
    
    // Initialisation du menu du chat
    backToMenu();
});

// --- 2. CALCULS ET MISE À JOUR (Temps réel) ---
function updateAll() {
    // Calcul Prix Séjour
    const dIn = document.getElementById('date-in')?.value;
    const dOut = document.getElementById('date-out')?.value;
    let nightPrice = 0;
    if (dIn && dOut) {
        const diff = (new Date(dOut) - new Date(dIn)) / (1000 * 60 * 60 * 24);
        nightPrice = Math.max(0, diff) * 200;
    }
    const nightEl = document.getElementById('night-total');
    if (nightEl) nightEl.innerText = nightPrice;

    // Calcul Pack
    const packSelect = document.getElementById('pack-select');
    const packPrice = packSelect ? parseInt(packSelect.value) || 0 : 0;
    const packEl = document.getElementById('pack-total');
    if (packEl) packEl.innerText = packPrice;

    // Calcul Services
    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach(item => {
        totalServices += parseFloat(item.value);
    });
    const svcEl = document.getElementById('services-total-display');
    if (svcEl) svcEl.innerText = totalServices;

    // Total Final
    const totalEl = document.getElementById('display-total-final');
    if (totalEl) totalEl.innerText = (nightPrice + packPrice + totalServices) + "€";
}

// --- 3. LOGIQUE CHATBOT ---
function toggleChat() {
    const chatBody = document.getElementById('chat-body');
    const icon = document.getElementById('chat-icon');
    if (!chatBody || !icon) return;
    
    chatBody.classList.toggle('open');
    icon.classList.toggle('fa-chevron-up');
    icon.classList.toggle('fa-chevron-down');
}

function backToMenu() {
    const content = document.getElementById('chat-content');
    if (content) {
        content.innerHTML = `
            <strong>Que puis-je faire pour vous ?</strong>
            <div class="chat-options">
                <button type="button" onclick="showCategory('services')">🛎️ Nos Services</button>
            </div>`;
    }
}

function renderService(name, price) {
    return `
        <div class="service-row" style="margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
            <label style="display:block; margin-bottom:5px;">
                <input type="checkbox" class="service-item" value="${price}" onchange="updateAll()"> 
                <strong>${name}</strong> - ${price}€
            </label>
            <input type="datetime-local" class="service-date" style="width:100%; padding:5px; border:1px solid #ccc; border-radius:4px;">
        </div>`;
}

function showCategory(cat) {
    const container = document.getElementById('chat-content');
    if (!container) return;
    
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
            <input type="datetime-local" class="service-date" style="width:100%; padding:5px;">
            <textarea class="service-desc" placeholder="Détails du problème..." style="width:100%; margin-top:5px; padding:5px;"></textarea>
        </div>
        <button type="button" onclick="sendServicesRequest()" style="width:100%; background:#28a745; color:white; padding:10px; margin-top:10px; border:none; cursor:pointer;">Envoyer la demande</button>
    `;
}

// --- 4. ENVOI EMAIL ---
function sendServicesRequest() {
    // 1. Collecte des données du formulaire principal
    const dateIn = document.getElementById('date-in')?.value || "Non précisé";
    const dateOut = document.getElementById('date-out')?.value || "Non précisé";
    
    // 2. Collecte des services cochés
    let detailsServices = [];
    document.querySelectorAll('.service-row').forEach(row => {
        const check = row.querySelector('.service-item');
        if (check && check.checked) {
            const rawDate = row.querySelector('.service-date')?.value;
            const dateFr = rawDate ? rawDate.replace('T', ' à ') : "Date non précisée";
            const desc = row.querySelector('.service-desc')?.value || "";
            const name = check.parentElement.innerText.split('-')[0].trim();
            detailsServices.push(`${name} (${dateFr}) ${desc}`);
        }
    });

    // 3. Construction des paramètres pour EmailJS
    const templateParams = {
        client_name: (document.getElementById('client-firstname')?.value || "") + " " + (document.getElementById('client-lastname')?.value || ""),
        client_email: document.getElementById('email')?.value || "Non fourni",
        client_phone: document.getElementById('phone')?.value || "Non fourni",
        bungalow: document.getElementById('bungalow')?.value || "Non choisi",
        dates: `Du ${dateIn} au ${dateOut}`,
        liste_services: detailsServices.length > 0 ? detailsServices.join(" | ") : "Aucun",
        total_final: document.getElementById('display-total-final')?.innerText || "0€"
    };

    // 4. Envoi
    emailjs.send("service_8chuqsf", "template_ip31gnr", templateParams)
        .then(() => {
            alert("Demande envoyée avec succès !");
            backToMenu();
        }, (err) => {
            console.error("Erreur EmailJS:", err);
            alert("Erreur lors de l'envoi de la demande.");
        });
}
