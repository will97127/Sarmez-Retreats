// --- CALCULS ET MISE À JOUR ---
function updateAll() {
    // 1. Calcul Nuits (Bungalow)
    const dateIn = document.getElementById('date-in')?.value;
    const dateOut = document.getElementById('date-out')?.value;
    let nightPrice = 0;
    if (dateIn && dateOut) {
        const diff = (new Date(dateOut) - new Date(dateIn)) / (1000 * 60 * 60 * 24);
        nightPrice = Math.max(0, diff) * 200;
    }
    
    // 2. Calcul Pack
    const packPrice = parseInt(document.getElementById('pack-select')?.value) || 0;
    
    // 3. Calcul Services
    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach(item => totalServices += parseFloat(item.value));
    
    // Mise à jour des éléments HTML
    if (document.getElementById('night-total')) document.getElementById('night-total').innerText = nightPrice;
    if (document.getElementById('pack-total')) document.getElementById('pack-total').innerText = packPrice;
    if (document.getElementById('services-total')) document.getElementById('services-total').innerText = totalServices + "€";
    if (document.getElementById('display-total-final')) document.getElementById('display-total-final').innerText = (nightPrice + packPrice + totalServices) + "€";
}

// --- LOGIQUE CHATBOT ---
function toggleChat() { document.getElementById('chat-body')?.classList.toggle('open'); }

function backToMenu() {
    document.getElementById('chat-content').innerHTML = `
        <strong>Que puis-je faire pour vous ?</strong>
        <div class="chat-options"><button type="button" onclick="showCategory('services')">🛎️ Nos Services</button></div>
        <hr><p>Total services : <strong id="services-total">0€</strong></p>`;
}

function showCategory(cat) {
    const container = document.getElementById('chat-content');
    container.innerHTML = `
        <button onclick="backToMenu()">⬅ Retour</button>
        <div class="service-row">
            <label><input type="checkbox" class="service-item" value="15" onchange="updateAll()"> Petit déjeuner (15€)</label><br>
            <input type="datetime-local" class="service-date" style="width:100%;">
        </div>
        <div class="service-row">
            <label><input type="checkbox" class="service-item" value="110" onchange="updateAll()"> Massage Solo (110€)</label><br>
            <input type="datetime-local" class="service-date" style="width:100%;">
        </div>
        <hr>
        <p>Total services : <strong id="services-total">0€</strong></p>
        <button onclick="sendServicesRequest()" style="background:green; color:white; width:100%;">Envoyer la demande</button>
    `;
    updateAll();
}

// --- ENVOI EMAIL ---
function sendServicesRequest() {
    let detailsServices = [];
    document.querySelectorAll('.service-row').forEach(row => {
        const check = row.querySelector('.service-item');
        if (check?.checked) {
            const date = row.querySelector('.service-date')?.value || "Date non précisée";
            detailsServices.push(`${check.parentElement.innerText.split('(')[0]} (${date.replace('T', ' à ')})`);
        }
    });

    const templateParams = {
        client_name: document.getElementById('client-firstname')?.value + ' ' + document.getElementById('client-lastname')?.value,
        client_email: document.getElementById('email')?.value,
        liste_services: detailsServices.join(" | "),
        total_final: document.getElementById('display-total-final')?.innerText
    };

    emailjs.send("service_8chuqsf", "template_ip31gnr", templateParams)
        .then(() => alert("Envoyé !"));
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    ['date-in', 'date-out', 'pack-select', 'bungalow'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', updateAll);
    });
});
