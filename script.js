// --- 1. LOGIQUE CHATBOT ---
function toggleChat() {
    const chatBody = document.getElementById('chat-body');
    const icon = document.getElementById('chat-icon');
    chatBody.classList.toggle('open'); // Assurez-vous que .chat-body.open existe dans votre CSS
    if (icon.classList.contains('fa-chevron-up')) {
        icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
    } else {
        icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
    }
}

function backToMenu() {
    document.getElementById('chat-content').innerHTML = `
        <strong>Que puis-je faire pour vous ?</strong>
        <div class="chat-options">
            <button type="button" onclick="showCategory('services')">🛎️ Nos Services</button>
        </div>`;
}

function renderService(name, price) {
    return `
        <div class="service-row" style="margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px;">
            <label style="display:block; margin-bottom:5px;">
                <input type="checkbox" class="service-item" value="${price}" onchange="updateAll()"> 
                <strong>${name}</strong> - ${price}€
            </label>
            <input type="datetime-local" class="service-date" style="width:100%; padding:5px; border:1px solid #ccc;">
        </div>`;
}

function showCategory(cat) {
    const container = document.getElementById('chat-content');
    container.innerHTML = `
        <button onclick="backToMenu()" style="margin-bottom:10px;">⬅ Retour</button><br>
        ${renderService("Petit déjeuner", 15)}
        ${renderService("Ménage", 20)}
        ${renderService("Massage Solo", 110)}
        ${renderService("Massage Duo", 180)}
        ${renderService("Charrette Couple", 180)}
        ${renderService("Charrette Famille", 300)}
        ${renderService("Kayak/Paddle Couple", 240)}
        ${renderService("Kayak/Paddle Famille", 400)}
        <div class="service-row" style="margin-bottom:15px;">
            <label><input type="checkbox" class="service-item" value="0" onchange="updateAll()"> 🛠 Problème technique</label><br>
            <input type="datetime-local" class="service-date" style="width:100%; margin-top:5px; padding:5px;">
            <textarea class="service-desc" placeholder="Détails du problème..." style="width:100%; margin-top:5px;"></textarea>
        </div>
        <button type="button" onclick="sendServicesRequest()" style="width:100%; background:#28a745; color:white; padding:12px; border:none; cursor:pointer; font-weight:bold;">Envoyer ma demande</button>
    `;
}

// --- 2. CALCULS EN TEMPS RÉEL ---
function updateAll() {
    // Bungalow
    const dIn = document.getElementById('date-in').value;
    const dOut = document.getElementById('date-out').value;
    let nightPrice = 0;
    if (dIn && dOut) {
        const diff = (new Date(dOut) - new Date(dIn)) / (1000 * 60 * 60 * 24);
        nightPrice = Math.max(0, diff) * 200;
    }
    document.getElementById('night-total').innerText = nightPrice;

    // Packs
    const packPrice = parseInt(document.getElementById('pack-select').value) || 0;
    document.getElementById('pack-total').innerText = packPrice;

    // Services
    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach(item => totalServices += parseFloat(item.value));
    document.getElementById('services-total-display').innerText = totalServices;

    // Total Final
    document.getElementById('display-total-final').innerText = (nightPrice + packPrice + totalServices) + "€";
}

// --- 3. ENVOI EMAIL ---
function sendServicesRequest() {
    let detailsServices = [];
    document.querySelectorAll('.service-row').forEach(row => {
        const check = row.querySelector('.service-item');
        if (check && check.checked) {
            const rawDate = row.querySelector('.service-date').value;
            let dateFr = "Non précisée";
            if (rawDate) {
                const parts = rawDate.split('T');
                const d = parts[0].split('-');
                dateFr = `${d[2]}/${d[1]}/${d[0]} à ${parts[1]}`;
            }
            const name = check.parentElement.innerText.split('-')[0].trim();
            detailsServices.push(`${name} (${dateFr})`);
        }
    });

    const templateParams = {
        client_name: document.getElementById('client-firstname').value + " " + document.getElementById('client-lastname').value,
        client_email: document.getElementById('email').value,
        client_phone: document.getElementById('phone').value,
        bungalow: document.getElementById('bungalow').value,
        dates: `Du ${document.getElementById('date-in').value} au ${document.getElementById('date-out').value}`,
        liste_services: detailsServices.length > 0 ? detailsServices.join(" | ") : "Aucun",
        total_final: document.getElementById('display-total-final').innerText
    };

    emailjs.send("service_8chuqsf", "template_ip31gnr", templateParams);
    emailjs.send("service_8chuqsf", "template_7m5glbl", templateParams)
        .then(() => alert("Demande envoyée avec succès !"), (err) => alert("Erreur d'envoi."));
}

// --- 4. INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    ['date-in', 'date-out', 'pack-select', 'bungalow'].forEach(id => {
        document.getElementById(id).addEventListener('change', updateAll);
    });
    backToMenu();
});
