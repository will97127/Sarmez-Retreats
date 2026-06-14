// --- CALCULS EN TEMPS RÉEL ---
function updateAll() {
    const dateInVal = document.getElementById('date-in')?.value;
    const dateOutVal = document.getElementById('date-out')?.value;
    let nightPrice = 0;
    
    if (dateInVal && dateOutVal) {
        const dateIn = new Date(dateInVal);
        const dateOut = new Date(dateOutVal);
        const diffTime = Math.abs(dateOut - dateIn);
        const nights = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        nightPrice = nights * 200;
    }
    
    const nTotal = document.getElementById('night-total');
    if (nTotal) nTotal.innerText = nightPrice;

    const packSelect = document.getElementById('pack-select');
    const packPrice = packSelect ? parseInt(packSelect.value) || 0 : 0;
    const pTotal = document.getElementById('pack-total');
    if (pTotal) pTotal.innerText = packPrice;

    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach((item) => {
        totalServices += parseFloat(item.value || 0);
    });
    
    const servicesDisplay = document.getElementById('services-total');
    if (servicesDisplay) servicesDisplay.innerText = totalServices + "€";

    const grandTotal = nightPrice + packPrice + totalServices;
    const finalDisplay = document.getElementById('display-total-final');
    if (finalDisplay) finalDisplay.innerText = grandTotal + "€";
}

// --- LOGIQUE CHATBOT ---
function toggleChat() {
    const chatBody = document.getElementById('chat-body');
    const icon = document.getElementById('chat-icon');
    if (chatBody) chatBody.classList.toggle('open');
    if (icon) {
        icon.classList.toggle('fa-chevron-up');
        icon.classList.toggle('fa-chevron-down');
    }
}

function showCategory(cat) {
    const container = document.getElementById('chat-content');
    if (!container) return;
    
    const servicesHTML = `
        <strong>Identification :</strong><br>
        <input type="text" id="chat-name" placeholder="Nom et Prénom" style="width:100%; margin-bottom:5px;">
        <input type="email" id="chat-email" placeholder="Email" style="width:100%; margin-bottom:5px;">
        <input type="tel" id="chat-phone" placeholder="Téléphone (WhatsApp)" style="width:100%; margin-bottom:5px;">
        <strong>Bungalow :</strong><br>
        <select id="chat-bungalow" style="width:100%; padding:5px; margin-bottom:10px;">
            <option value="SR Plage">SR Plage</option>
            <option value="SR Rivière">SR Rivière</option>
            <option value="SR Tradition">SR Tradition</option>
        </select>
        <strong>Services :</strong><br>
        <div class="service-row"><label><input type="checkbox" class="service-item" value="15" onchange="updateAll()"> Petit déjeuner : 15€</label><br><input type="datetime-local" class="service-date"></div>
        <div class="service-row"><label><input type="checkbox" class="service-item" value="20" onchange="updateAll()"> Ménage : 20€</label><br><input type="datetime-local" class="service-date"></div>
        <div class="service-row"><label><input type="checkbox" class="service-item" value="110" onchange="updateAll()"> Massage Solo : 110€</label><br><input type="datetime-local" class="service-date"></div>
        <div class="service-row"><label><input type="checkbox" class="service-item" value="180" onchange="updateAll()"> Massage Duo : 180€</label><br><input type="datetime-local" class="service-date"></div>
        <div class="service-row">
            <label><input type="checkbox" class="service-item" value="0" onchange="updateAll()"> 🛠 Technique</label><br>
            <input type="datetime-local" class="service-date">
            <textarea class="service-desc" placeholder="Détails..." style="width:100%;"></textarea>
        </div>
        <hr>
        <p>Total : <strong id="services-total">0€</strong></p>
        <button type="button" onclick="backToMenu()">⬅ Retour</button>
        <button type="button" onclick="sendServicesRequest()">Envoyer la demande</button>`;
    
    container.innerHTML = (cat === 'services') ? servicesHTML : "Catégorie non trouvée.";
}

function backToMenu() {
    document.getElementById('chat-content').innerHTML = `
        <strong>Que puis-je faire pour vous ?</strong>
        <div class="chat-options">
            <button type="button" onclick="showCategory('services')">🛎️ Nos Services</button>
        </div>`;
}

// --- ENVOI DES DONNÉES EMAILJS ---
function sendServicesRequest() {
    const clientName = document.getElementById('chat-name')?.value || "Non précisé";
    const emailClient = document.getElementById('chat-email')?.value || document.getElementById('email')?.value;
    const phoneClient = document.getElementById('chat-phone')?.value || document.getElementById('phone')?.value;
    const bungalow = document.getElementById('chat-bungalow')?.value || document.getElementById('bungalow')?.value;
    const totalFinal = document.getElementById('display-total-final')?.innerText || "0€";
    
    const packSelect = document.getElementById('pack-select');
    const packName = packSelect ? packSelect.options[packSelect.selectedIndex].getAttribute('data-name') : "Aucun";

    const formatDate = (dateStr) => {
        if (!dateStr) return "Non précisée";
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };

    const dateIn = formatDate(document.getElementById('date-in')?.value);
    const dateOut = formatDate(document.getElementById('date-out')?.value);

    if (!emailClient || !phoneClient || !bungalow) { 
        alert("Veuillez remplir Email, Téléphone et choisir un bungalow."); 
        return; 
    }

    let servicesDetails = [];
    document.querySelectorAll('.service-row').forEach(row => {
        const checkbox = row.querySelector('.service-item');
        if (checkbox && checkbox.checked) {
            const name = checkbox.parentElement.innerText.split(':')[0].trim();
            const dateInput = row.querySelector('.service-date');
            
            let dateVal = "Date non précisée";
            if (dateInput?.value) {
                const d = new Date(dateInput.value);
                if (!isNaN(d.getTime())) {
                    dateVal = d.toLocaleDateString('fr-FR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    });
                }
            }
            
            const descInput = row.querySelector('.service-desc');
            const desc = descInput?.value ? " - Note: " + descInput.value : "";
            servicesDetails.push(`${name} : Le ${dateVal}${desc}`);
        }
    });

    const templateParams = {
        client_name: clientName,
        client_email: emailClient,
        client_phone: phoneClient,
        bungalow: bungalow,
        dates: `${dateIn} au ${dateOut}`,
        pack: packName,
        services_list: servicesDetails.length > 0 ? servicesDetails.join("\n") : "Aucun service",
        total_final: totalFinal
    };

    const serviceID = "service_8chuqsf";
    
    emailjs.send(serviceID, "template_ip31gnr", templateParams);
    emailjs.send(serviceID, "template_7m5glbl", templateParams)
        .then(() => {
            alert("Demande envoyée avec succès !");
            backToMenu();
            toggleChat();
        }, (err) => alert("Erreur : " + JSON.stringify(err)));
}

document.addEventListener('DOMContentLoaded', () => {
    ['date-in', 'date-out', 'pack-select', 'bungalow'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updateAll);
    });
});
// Détection automatique des changements dans le chat pour le calcul en temps réel
document.addEventListener('change', (e) => {
    if (e.target.classList.contains('service-item') || e.target.classList.contains('service-date')) {
        updateAll();
    }
});
