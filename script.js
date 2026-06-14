// --- CALCULS EN TEMPS RÉEL ---
function updateAll() {
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

    const packSelect = document.getElementById('pack-select');
    const packPrice = parseInt(packSelect.value) || 0;
    document.getElementById('pack-total').innerText = packPrice;

    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach((item) => {
        totalServices += parseFloat(item.value);
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
    chatBody.classList.toggle('open');
    icon.classList.toggle('fa-chevron-up');
    icon.classList.toggle('fa-chevron-down');
}

function showCategory(cat) {
    const container = document.getElementById('chat-content');
    const servicesHTML = `
        <strong>Identification :</strong><br>
        <input type="text" id="chat-name" placeholder="Votre Nom" style="width:100%; margin-bottom:5px;">
        <input type="email" id="chat-email" placeholder="Votre Email" style="width:100%; margin-bottom:5px;">
        <strong>Bungalow :</strong><br>
        <select id="chat-bungalow" style="width:100%; padding:5px; margin-bottom:10px;">
            <option value="SR Plage">SR Plage</option>
            <option value="SR Rivière">SR Rivière</option>
            <option value="SR Tradition">SR Tradition</option>
        </select>
        <strong>Services :</strong><br>
        <div class="service-row"><label><input type="checkbox" class="service-item" value="15" onchange="updateAll()"> Petit déj : 15€</label><br><input type="datetime-local" class="service-date"></div>
        <div class="service-row"><label><input type="checkbox" class="service-item" value="20" onchange="updateAll()"> Ménage : 20€</label><br><input type="datetime-local" class="service-date"></div>
        <div class="service-row"><label><input type="checkbox" class="service-item" value="110" onchange="updateAll()"> Massage Solo : 110€</label><br><input type="datetime-local" class="service-date"></div>
        <hr>
        <p>Total : <strong id="services-total">0€</strong></p>
        <button type="button" onclick="sendServicesRequest()">Envoyer la demande</button>`;
    container.innerHTML = servicesHTML;
}

// --- ENVOI DES DONNÉES EMAILJS ---
function sendServicesRequest() {
    // Récupération sécurisée des données
    const isChat = !!document.getElementById('chat-name');
    const clientName = isChat ? document.getElementById('chat-name').value : "Client Site";
    const emailClient = isChat ? document.getElementById('chat-email').value : document.getElementById('email').value;
    const bungalow = isChat ? document.getElementById('chat-bungalow').value : document.getElementById('bungalow').value;
    const totalFinal = document.getElementById('display-total-final').innerText;
    
    if (!emailClient || !bungalow) {
        alert("Veuillez remplir au moins votre email et choisir un bungalow.");
        return;
    }

    let servicesDetails = [];
    document.querySelectorAll('.service-item:checked').forEach(item => {
        const row = item.closest('.service-row');
        const name = item.parentElement.innerText.split(':')[0].trim();
        servicesDetails.push(name);
    });

    const templateParams = {
        client_name: clientName,
        client_email: emailClient,
        bungalow: bungalow,
        services_list: servicesDetails.length > 0 ? servicesDetails.join(", ") : "Aucun",
        total_final: totalFinal
    };

    // Envoi
    emailjs.send("service_8chuqsf", "template_ip31gnr", templateParams)
        .then(() => {
            alert("Merci ! Votre demande a bien été envoyée.");
        })
        .catch((err) => {
            alert("Erreur lors de l'envoi : " + JSON.stringify(err));
        });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    ['date-in', 'date-out', 'pack-select', 'bungalow'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updateAll);
    });
});
