// --- FONCTION DE CALCUL UNIFIÉE ---
function updateAll() {
    // 1. Calcul du prix des nuits
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

    // 2. Calcul du prix du pack
    const packSelect = document.getElementById('pack-select');
    const packPrice = parseInt(packSelect.value) || 0;

    // 3. Calcul des services (Checkboxes)
    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach((item) => {
        totalServices += parseFloat(item.value);
    });

    // Mise à jour de l'affichage
    const servTotalEl = document.getElementById('services-total');
    if (servTotalEl) servTotalEl.innerText = totalServices + "€";
    
    document.getElementById('night-total').innerText = nightPrice;
    document.getElementById('pack-total').innerText = packPrice;

    const grandTotal = nightPrice + packPrice + totalServices;
    document.getElementById('display-total-final').innerText = grandTotal + "€";
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
    const data = {
        'services': `<strong>Sélectionnez vos services :</strong><br>
            <div class="service-row"><label><input type="checkbox" class="service-item" value="15" onchange="updateAll()"> Petit déjeuner : 15€</label><br><input type="datetime-local" class="service-date"></div>
            <div class="service-row"><label><input type="checkbox" class="service-item" value="20" onchange="updateAll()"> Ménage : 20€</label><br><input type="datetime-local" class="service-date"></div>
            <div class="service-row"><label><input type="checkbox" class="service-item" value="110" onchange="updateAll()"> Massage Solo : 110€</label><br><input type="datetime-local" class="service-date"></div>
            <div class="service-row"><label><input type="checkbox" class="service-item" value="180" onchange="updateAll()"> Massage Duo : 180€</label><br><input type="datetime-local" class="service-date"></div>
            <hr><p>Total services : <strong id="services-total">0€</strong></p>
            <button type="button" onclick="backToMenu()">⬅ Retour</button>`
    };
    container.innerHTML = data[cat] || "Catégorie non trouvée.";
}

function backToMenu() {
    document.getElementById('chat-content').innerHTML = `
        <strong>Que puis-je faire pour vous ?</strong>
        <div class="chat-options">
            <button type="button" onclick="showCategory('services')">🛎️ Nos Services</button>
        </div>`;
}

// --- INITIALISATION ÉCOUTEURS ---
document.addEventListener('DOMContentLoaded', () => {
    ['date-in', 'date-out', 'pack-select'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updateAll);
    });

    const form = document.getElementById('booking-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert("Merci ! Votre demande est enregistrée.");
        });
    }
});

// --- ENVOI DEMANDE ---
function sendServicesRequest() {
    let selectedServices = [];
    document.querySelectorAll('.service-row').forEach(row => {
        const checkbox = row.querySelector('.service-item');
        if (checkbox && checkbox.checked) {
            const serviceName = checkbox.parentElement.innerText.split(':')[0].trim();
            const serviceDate = row.querySelector('.service-date').value || "Date non précisée";
            selectedServices.push(`${serviceName} (${serviceDate})`);
        }
    });

    if (selectedServices.length === 0) {
        alert("Veuillez sélectionner au moins un service.");
        return;
    }

    const message = "Services demandés :\n" + selectedServices.join("\n");
    window.location.href = `mailto:votre-email@exemple.com?subject=Demande de services Sarmèz&body=${encodeURIComponent(message)}`;
}
