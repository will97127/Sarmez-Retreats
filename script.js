// --- CALCULS EN TEMPS RÉEL ---
function updateAll() {
    // 1. Calcul nuits
    const dateInVal = document.getElementById('date-in').value;
    const dateOutVal = document.getElementById('date-out').value;
    let nightPrice = 0;
    if (dateInVal && dateOutVal) {
        const dateIn = new Date(dateInVal);
        const dateOut = new Date(dateOutVal);
        const diffTime = Math.abs(dateOut - dateIn);
        const nights = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        nightPrice = nights * 200;
    }
    document.getElementById('night-total').innerText = nightPrice;

    // 2. Calcul pack
    const packSelect = document.getElementById('pack-select');
    const packPrice = parseInt(packSelect.value) || 0;
    document.getElementById('pack-total').innerText = packPrice;

    // 3. Calcul services
    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach((item) => {
        totalServices += parseFloat(item.value);
    });
    const servicesDisplay = document.getElementById('services-total');
    if (servicesDisplay) servicesDisplay.innerText = totalServices + "€";

    // 4. Grand Total
    const grandTotal = nightPrice + packPrice + totalServices;
    const finalDisplay = document.getElementById('display-total-final');
    if (finalDisplay) finalDisplay.innerText = grandTotal + "€";
}

// --- LOGIQUE CHATBOT ---
function toggleChat() {
    const chatBody = document.getElementById('chat-body');
    const icon = document.getElementById('chat-icon');
    chatBody.classList.toggle('open');
    icon.classList.toggle('fa-chevron-up');
    icon.classList.toggle('fa-chevron-down');
}

function showCategory(cat) {
    const container = document.getElementById('chat-content');
    const servicesHTML = `
        <strong>Sélectionnez vos services :</strong><br>
        <div class="service-row"><label><input type="checkbox" class="service-item" value="15" onchange="updateAll()"> Petit déjeuner : 15€</label><br><input type="datetime-local" class="service-date"></div>
        <div class="service-row"><label><input type="checkbox" class="service-item" value="20" onchange="updateAll()"> Ménage : 20€</label><br><input type="datetime-local" class="service-date"></div>
        <div class="service-row"><label><input type="checkbox" class="service-item" value="110" onchange="updateAll()"> Massage Solo : 110€</label><br><input type="datetime-local" class="service-date"></div>
        <div class="service-row"><label><input type="checkbox" class="service-item" value="180" onchange="updateAll()"> Massage Duo : 180€</label><br><input type="datetime-local" class="service-date"></div>
        <div class="service-row">
            <label><input type="checkbox" class="service-item" value="0" onchange="updateAll()"> 🛠 Problème technique</label><br>
            <input type="datetime-local" class="service-date">
            <textarea class="service-desc" placeholder="Décrivez le problème..." style="width:100%;"></textarea>
        </div>
        <hr>
        <p>Total services : <strong id="services-total">0€</strong></p>
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
    const emailClient = document.getElementById('email').value;
    const bungalow = document.getElementById('bungalow').value;
    const totalFinal = document.getElementById('display-total-final').innerText;
    
    // Récupération propre du nom du pack
    const packSelect = document.getElementById('pack-select');
    const packName = packSelect.options[packSelect.selectedIndex].getAttribute('data-name') || "Aucun";

    if (!emailClient || !bungalow) { 
        alert("Veuillez remplir votre email et choisir un bungalow."); 
        return; 
    }

    let servicesDetails = [];
    document.querySelectorAll('.service-item:checked').forEach(item => {
        const row = item.closest('.service-row');
        const name = item.parentElement.innerText.split(':')[0].trim();
        const date = row.querySelector('.service-date').value || "Date non précisée";
        const desc = row.querySelector('.service-desc') ? " - Note: " + row.querySelector('.service-desc').value : "";
        servicesDetails.push(`${name} (${date})${desc}`);
    });

    const templateParams = {
        client_email: emailClient,
        bungalow: bungalow,
        dates: document.getElementById('date-in').value + " au " + document.getElementById('date-out').value,
        pack: packName, // Variable {{pack}} pour vos templates
        services_list: servicesDetails.length > 0 ? servicesDetails.join(", \n") : "Aucun service",
        total_final: totalFinal
    };

    const serviceID = "service_8chuqsf";
    
    // 1. Mail Propriétaire
    emailjs.send(serviceID, "template_ip31gnr", templateParams);
    
    // 2. Mail Client
    emailjs.send(serviceID, "template_7m5glbl", templateParams)
        .then(() => {
            alert("Demande envoyée avec succès !");
        }, (err) => {
            alert("Erreur d'envoi : " + JSON.stringify(err));
        });
}

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    ['date-in', 'date-out', 'pack-select', 'bungalow'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updateAll);
    });
});
