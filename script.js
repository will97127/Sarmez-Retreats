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
        <div class="service-row" style="margin-bottom:12px; border-bottom:1px solid #eee; padding-bottom:5px;">
            <label><input type="checkbox" class="service-item" value="${price}" onchange="updateAll()"> ${name} : ${price}€</label><br>
            <textarea class="service-details" placeholder="Précisez votre demande..." style="width:100%; height:40px; margin-top:5px;"></textarea>
        </div>`;
}

function showCategory(cat) {
    const container = document.getElementById('chat-content');
    if (cat === 'services' && container) {
        container.innerHTML = `
            <div style="font-size: 0.9em;">
                <strong>Vos coordonnées :</strong>
                <input type="text" id="chat-name" placeholder="Nom et Prénom" style="width:100%; margin-bottom:5px;">
                <input type="email" id="chat-email" placeholder="Email" style="width:100%; margin-bottom:5px;">
                <input type="tel" id="chat-phone" placeholder="Téléphone" style="width:100%; margin-bottom:10px;">
                
                <strong>Votre Bungalow :</strong>
                <select id="chat-bungalow" style="width:100%; margin-bottom:10px;">
                    <option value="Non précisé">Choisir un bungalow</option>
                    <option value="SR Plage">SR Plage</option>
                    <option value="SR Rivière">SR Rivière</option>
                    <option value="SR Tradition">SR Tradition</option>
                </select>
                
                <strong>Services souhaités :</strong><br>
                ${renderService("Petit déjeuner", 15)}
                ${renderService("Ménage", 20)}
                ${renderService("Massage Solo", 110)}
                ${renderService("Massage Duo", 180)}
                ${renderService("Charrette Couple", 180)}
                ${renderService("Charrette Famille", 300)}
                ${renderService("Kayak/Paddle Couple", 240)}
                ${renderService("Kayak/Paddle Famille", 400)}
                <div class="service-row" style="margin-bottom:10px;">
                    <label><input type="checkbox" class="service-item" value="0" onchange="updateAll()"> 🛠 Problème technique</label><br>
                    <textarea class="service-details" placeholder="Détails du problème" style="width:100%; height:60px;"></textarea>
                </div>
                <hr>
                <p>Total : <strong id="services-total">0€</strong></p>
                <button type="button" onclick="sendServicesRequest()" style="width:100%; padding:10px; background:#28a745; color:white; border:none; cursor:pointer; margin-bottom:5px;">Envoyer la demande</button>
                <button type="button" onclick="backToMenu()" style="width:100%;">⬅ Retour</button>
            </div>
        `;
    }
}

// --- CALCULS ET ENVOI ---
function updateAll() {
    const dateInVal = document.getElementById('date-in')?.value;
    const dateOutVal = document.getElementById('date-out')?.value;
    let nightPrice = 0;
    if (dateInVal && dateOutVal) {
        const diffTime = Math.abs(new Date(dateOutVal) - new Date(dateInVal));
        nightPrice = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24))) * 200;
    }
    
    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach(item => totalServices += parseFloat(item.value));
    
    const packPrice = parseInt(document.getElementById('pack-select')?.value) || 0;
    
    if (document.getElementById('night-total')) document.getElementById('night-total').innerText = nightPrice;
    if (document.getElementById('pack-total')) document.getElementById('pack-total').innerText = packPrice;
    if (document.getElementById('services-total')) document.getElementById('services-total').innerText = totalServices + "€";
    if (document.getElementById('display-total-final')) document.getElementById('display-total-final').innerText = (nightPrice + packPrice + totalServices) + "€";
}

function sendServicesRequest() {
    const name = document.getElementById('chat-name')?.value || `${document.getElementById('client-firstname')?.value || ''} ${document.getElementById('client-lastname')?.value || ''}`;
    const email = document.getElementById('chat-email')?.value || document.getElementById('email')?.value;
    const phone = document.getElementById('chat-phone')?.value || document.getElementById('phone')?.value;
    
    const mainBungalow = document.getElementById('bungalow')?.value;
    const chatBungalow = document.getElementById('chat-bungalow')?.value;
    const bungalowFinal = mainBungalow || (chatBungalow !== "Non précisé" ? chatBungalow : null);

    if (!name || !bungalowFinal) { 
        alert("Veuillez renseigner votre nom et sélectionner un bungalow."); 
        return; 
    }

    // Mise en forme HTML des services (Gras + Italique)
    let detailsServices = [];
    document.querySelectorAll('.service-item:checked').forEach(checkbox => {
        const parentRow = checkbox.closest('.service-row');
        const detail = parentRow.querySelector('.service-details')?.value || 'Aucune précision';
        const serviceName = parentRow.querySelector('label').innerText.split(':')[0].trim();
        detailsServices.push(`<b>${serviceName}</b> : <i>${detail}</i>`);
    });

    const formatDate = (d) => { if(!d) return "Non précisé"; const [y, m, d2] = d.split('-'); return `${d2}/${m}/${y}`; };
    const dateIn = document.getElementById('date-in')?.value;
    const dateOut = document.getElementById('date-out')?.value;
    
    // Mise en forme HTML des dates (Gras)
    const datesStr = (dateIn && dateOut) ? `Du <b>${formatDate(dateIn)}</b> au <b>${formatDate(dateOut)}</b>` : "<b>Client déjà sur place</b>";

    const templateParams = {
        client_name: name,
        client_email: email || 'Non renseigné',
        client_phone: phone || 'Non renseigné',
        bungalow: bungalowFinal,
        dates: datesStr,
        pack_choisi: document.getElementById('pack-select')?.options[document.getElementById('pack-select')?.selectedIndex]?.text || 'Aucun',
        liste_services: detailsServices.length > 0 ? detailsServices.join(" <br> ") : "Aucun service sélectionné",
        total_final: document.getElementById('display-total-final')?.innerText || '0€'
    };

    emailjs.send("service_8chuqsf", "template_ip31gnr", templateParams);
    emailjs.send("service_8chuqsf", "template_7m5glbl", templateParams)
        .then(() => alert("Demande envoyée avec succès !"), (err) => alert("Erreur : " + JSON.stringify(err)));
}

document.addEventListener('DOMContentLoaded', () => {
    ['date-in', 'date-out', 'pack-select', 'bungalow'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', updateAll);
    });
    backToMenu();
});
