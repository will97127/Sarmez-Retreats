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
            <input type="datetime-local" class="service-date" style="width:100%;">
        </div>`;
}

function showCategory(cat) {
    const container = document.getElementById('chat-content');
    if (cat === 'services' && container) {
        container.innerHTML = `
            <strong>Sélectionnez vos services :</strong><br>
            ${renderService("Petit déjeuner", 15)}
            ${renderService("Ménage", 20)}
            ${renderService("Massage Solo", 110)}
            ${renderService("Massage Duo", 180)}
            ${renderService("Charrette Couple", 180)}
            ${renderService("Charrette Famille", 300)}
            ${renderService("Kayak/Paddle Couple", 240)}
            ${renderService("Kayak/Paddle Famille", 400)}
            <div class="service-row" style="margin-bottom:10px;">
                <label><input type="checkbox" class="service-item" value="0" onchange="updateAll()"> 🛠 Problème technique (Gratuit)</label><br>
                <input type="datetime-local" class="service-date" style="width:100%;"><br>
                <textarea class="service-desc" placeholder="Décrivez votre problème" style="width:100%; height:60px;"></textarea>
            </div>
            <hr>
            <p>Total services : <strong id="services-total">0€</strong></p>
            <button type="button" onclick="backToMenu()">⬅ Retour</button>
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
    const bungalow = document.getElementById('bungalow')?.value;
    if (!bungalow) { alert("Veuillez sélectionner un bungalow."); return; }

    let detailsServices = [];
    document.querySelectorAll('.service-row').forEach(row => {
        const checkbox = row.querySelector('.service-item');
        if (checkbox?.checked) {
            const date = row.querySelector('.service-date').value;
            const desc = row.querySelector('.service-desc')?.value || "";
            // Formatage propre : Service (Date) - Description
            detailsServices.push(`${checkbox.parentElement.innerText.split(':')[0]} (${date || 'Aucune date'})${desc ? ' : ' + desc : ''}`);
        }
    });

    const formatDate = (d) => { if(!d) return "Non précisé"; const [y, m, d2] = d.split('-'); return `${d2}/${m}/${y}`; };
    
    const templateParams = {
        client_name: `${document.getElementById('client-firstname')?.value || ''} ${document.getElementById('client-lastname')?.value || ''}`,
        client_email: document.getElementById('email')?.value || '',
        client_phone: document.getElementById('phone')?.value || '',
        bungalow: bungalow,
        dates: `Du ${formatDate(document.getElementById('date-in')?.value)} au ${formatDate(document.getElementById('date-out')?.value)}`,
        pack_choisi: document.getElementById('pack-select')?.options[document.getElementById('pack-select')?.selectedIndex]?.text || 'Aucun',
        liste_services: detailsServices.length > 0 ? detailsServices.join(" | ") : "Aucun service",
        total_final: document.getElementById('display-total-final')?.innerText || '0€'
    };

    emailjs.send("service_8chuqsf", "template_ip31gnr", templateParams);
    emailjs.send("service_8chuqsf", "template_7m5glbl", templateParams)
        .then(() => alert("Demande envoyée avec succès !"), (err) => alert("Erreur : " + JSON.stringify(err)));
}

document.addEventListener('DOMContentLoaded', () => {
    ['date-in', 'date-out', 'pack-select', 'bungalow'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', updateAll);
    });
    backToMenu();
});
