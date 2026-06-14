// --- 1. INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    // On attache l'écouteur d'événement uniquement au formulaire principal
    const formFields = ['date-in', 'date-out', 'pack-select', 'bungalow'];
    formFields.forEach(id => {
        document.getElementById(id)?.addEventListener('change', updateAll);
    });
    backToMenu();
});

// --- 2. CALCULS ET MISE À JOUR (Barre de prix) ---
function updateAll() {
    const dIn = document.getElementById('date-in')?.value;
    const dOut = document.getElementById('date-out')?.value;
    const nightPrice = (dIn && dOut) ? Math.max(0, (new Date(dOut) - new Date(dIn)) / (1000 * 60 * 60 * 24)) * 200 : 0;
    const packPrice = parseInt(document.getElementById('pack-select')?.value) || 0;
    
    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach(item => totalServices += parseFloat(item.value));

    // Mise à jour de la barre en bas de page
    document.getElementById('night-total').innerText = nightPrice;
    document.getElementById('pack-total').innerText = packPrice;
    document.getElementById('services-total-display').innerText = totalServices;
    document.getElementById('display-total-final').innerText = (nightPrice + packPrice + totalServices) + "€";
}

// --- 3. LOGIQUE CHATBOT ---
function toggleChat() {
    document.getElementById('chat-body').classList.toggle('open');
    const icon = document.getElementById('chat-icon');
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

function showCategory() {
    document.getElementById('chat-content').innerHTML = `
        <button onclick="backToMenu()" style="margin-bottom:10px;">⬅ Retour</button>
        <div class="service-row">
            <label><input type="checkbox" class="service-item" value="15" onchange="updateAll()"> Petit déjeuner - 15€</label>
            <input type="datetime-local" class="service-date">
        </div>
        <div class="service-row">
            <label><input type="checkbox" class="service-item" value="110" onchange="updateAll()"> Massage Solo - 110€</label>
            <input type="datetime-local" class="service-date">
        </div>
        <button type="button" onclick="sendServicesRequest()" style="width:100%; background:#28a745; color:white; padding:10px; margin-top:10px;">Envoyer la demande</button>
    `;
}

// --- 4. ENVOI EMAIL (LE BLOC CLÉ) ---
function sendServicesRequest() {
    // Lecture directe dans les éléments DOM du formulaire principal
    const dateIn = document.getElementById('date-in').value || "Non précisé";
    const dateOut = document.getElementById('date-out').value || "Non précisé";
    
    let detailsServices = [];
    document.querySelectorAll('.service-row').forEach(row => {
        const check = row.querySelector('.service-item');
        if (check?.checked) {
            detailsServices.push(`${check.parentElement.innerText.split('-')[0].trim()} (${row.querySelector('.service-date').value})`);
        }
    });

    const templateParams = {
        client_name: document.getElementById('client-firstname').value + ' ' + document.getElementById('client-lastname').value,
        client_email: document.getElementById('email').value,
        bungalow: document.getElementById('bungalow').value,
        dates: `Du ${dateIn} au ${dateOut}`, // Variable dates forcée
        liste_services: detailsServices.length > 0 ? detailsServices.join(" | ") : "Aucun service",
        total_final: document.getElementById('display-total-final').innerText
    };

    emailjs.send("service_8chuqsf", "template_ip31gnr", templateParams)
        .then(() => alert("Demande envoyée !"));
}
