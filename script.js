// --- LOGIQUE CHATBOT ---
function toggleChat() {
    const chatBody = document.getElementById('chat-body');
    const icon = document.getElementById('chat-icon');
    chatBody?.classList.toggle('open');
    if (icon) {
        icon.classList.toggle('fa-chevron-up');
        icon.classList.toggle('fa-chevron-down');
    }
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
            <input type="datetime-local" class="service-date" style="width:100%; padding:5px;">
        </div>`;
}

function showCategory(cat) {
    const container = document.getElementById('chat-content');
    if (cat === 'services' && container) {
        container.innerHTML = `
            <button onclick="backToMenu()" style="margin-bottom:10px;">⬅ Retour</button>
            <strong>Vos coordonnées :</strong>
            <input type="text" id="chat-name" placeholder="Nom complet" style="width:100%; margin-bottom:5px; padding:5px;">
            <input type="email" id="chat-email" placeholder="Email" style="width:100%; margin-bottom:10px; padding:5px;">
            
            <strong>Sélectionnez vos services :</strong><br>
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
                <input type="datetime-local" class="service-date" style="width:100%; margin-top:5px; padding:5px;"><br>
                <textarea class="service-desc" placeholder="Décrivez votre problème" style="width:100%; margin-top:5px;"></textarea>
            </div>
            
            <hr>
            <p>Total services : <strong id="services-total">0€</strong></p>
            <button type="button" onclick="sendServicesRequest()" style="width:100%; background:#28a745; color:white; padding:10px; border:none; cursor:pointer; font-weight:bold;">
                Envoyer ma demande
            </button>
        `;
    }
}

// --- CALCULS ET ENVOI ---
function updateAll() {
    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach(item => totalServices += parseFloat(item.value));
    const totalEl = document.getElementById('services-total');
    if (totalEl) totalEl.innerText = totalServices + "€";
}

function sendServicesRequest() {
    const formatDateTimeFr = (d) => {
        if (!d) return "Non précisée";
        const [datePart, timePart] = d.split('T');
        if (!datePart) return "Non précisée";
        const [y, m, d2] = datePart.split('-');
        return `${d2}/${m}/${y} à ${timePart}`;
    };

    let detailsServices = [];
    document.querySelectorAll('.service-row').forEach(row => {
        const checkbox = row.querySelector('.service-item');
        if (checkbox?.checked) {
            const dateValue = row.querySelector('.service-date')?.value;
            const descValue = row.querySelector('.service-desc')?.value || "";
            const dateFormatted = formatDateTimeFr(dateValue);
            const serviceName = checkbox.parentElement.innerText.split('-')[0].trim();
            detailsServices.push(`${serviceName} (Date : ${dateFormatted})${descValue ? ' : ' + descValue : ''}`);
        }
    });

    const templateParams = {
        client_name: document.getElementById('chat-name')?.value || document.getElementById('client-lastname')?.value,
        client_email: document.getElementById('chat-email')?.value || document.getElementById('email')?.value,
        liste_services: detailsServices.length > 0 ? detailsServices.join(" | ") : "Aucun service sélectionné",
        total_final: document.getElementById('services-total')?.innerText || '0€'
    };

    emailjs.send("service_8chuqsf", "template_ip31gnr", templateParams)
        .then(() => alert("Demande envoyée avec succès !"), (err) => alert("Erreur : " + JSON.stringify(err)));
}

document.addEventListener('DOMContentLoaded', () => {
    backToMenu();
});
