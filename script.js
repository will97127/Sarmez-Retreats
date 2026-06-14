// --- LOGIQUE GÉNÉRALE ---
function updateAll() {
    // 1. Calcul Séjour (Bungalow)
    const dateInVal = document.getElementById('date-in')?.value;
    const dateOutVal = document.getElementById('date-out')?.value;
    let nightPrice = 0;
    if (dateInVal && dateOutVal) {
        const diffTime = Math.abs(new Date(dateOutVal) - new Date(dateInVal));
        nightPrice = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) * 200;
    }
    document.getElementById('night-total').innerText = nightPrice;

    // 2. Calcul Pack
    const packPrice = parseInt(document.getElementById('pack-select')?.value) || 0;
    document.getElementById('pack-total').innerText = packPrice;

    // 3. Calcul Services (Chat)
    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach(item => totalServices += parseFloat(item.value));
    const servicesTotalEl = document.getElementById('services-total');
    if (servicesTotalEl) servicesTotalEl.innerText = totalServices + "€";

    // 4. Total Final
    document.getElementById('display-total-final').innerText = (nightPrice + packPrice + totalServices) + "€";
}

// --- LOGIQUE CHATBOT ---
function toggleChat() { document.getElementById('chat-body')?.classList.toggle('open'); }

function renderService(name, price) {
    return `
        <div class="service-row" style="margin-bottom:15px; border-bottom:1px solid #eee;">
            <label><input type="checkbox" class="service-item" value="${price}" onchange="updateAll()"> <strong>${name}</strong> - ${price}€</label><br>
            <input type="datetime-local" class="service-date" style="width:100%;">
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
        <button type="button" onclick="sendServicesRequest()" style="width:100%; background:#28a745; color:white; padding:10px; margin-top:10px;">Envoyer la demande</button>
    `;
    updateAll();
}

function backToMenu() {
    document.getElementById('chat-content').innerHTML = `
        <strong>Que puis-je faire pour vous ?</strong>
        <button onclick="showCategory('services')">🛎️ Nos Services</button>
        <p>Total services : <strong id="services-total">0€</strong></p>`;
}

// --- ENVOI EMAIL ---
function sendServicesRequest() {
    let detailsServices = [];
    document.querySelectorAll('.service-row').forEach(row => {
        const checkbox = row.querySelector('.service-item');
        if (checkbox?.checked) {
            const date = row.querySelector('.service-date').value || "Non précisée";
            const desc = row.querySelector('.service-desc')?.value || "";
            const name = checkbox.parentElement.innerText.split('-')[0].trim();
            detailsServices.push(`${name} (Date: ${date.replace('T', ' à ')}) ${desc}`);
        }
    });

    const templateParams = {
        client_name: document.getElementById('client-firstname')?.value + ' ' + document.getElementById('client-lastname')?.value,
        client_email: document.getElementById('email')?.value,
        bungalow: document.getElementById('bungalow')?.value,
        dates: document.getElementById('date-in')?.value + " au " + document.getElementById('date-out')?.value,
        liste_services: detailsServices.length > 0 ? detailsServices.join(" | ") : "Aucun",
        total_final: document.getElementById('display-total-final')?.innerText
    };

    emailjs.send("service_8chuqsf", "template_ip31gnr", templateParams)
        .then(() => alert("Demande envoyée !"));
}

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    ['date-in', 'date-out', 'pack-select', 'bungalow'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', updateAll);
    });
    backToMenu();
});
