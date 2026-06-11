// --- FONCTION DE CALCUL UNIFIÉE ---
function updateAll() {
    const dateIn = new Date(document.getElementById('date-in').value);
    const dateOut = new Date(document.getElementById('date-out').value);
    const diffTime = Math.abs(dateOut - dateIn);
    const nights = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const nightPrice = nights * 200;

    const packSelect = document.getElementById('pack-select');
    const packPrice = parseInt(packSelect.value) || 0;

    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach((item) => {
        totalServices += parseFloat(item.value);
    });

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
            <div class="service-row"><label><input type="checkbox" class="service-item" value="180" onchange="updateAll()"> Charrette Couple : 180€</label><br><input type="datetime-local" class="service-date"></div>
            <div class="service-row"><label><input type="checkbox" class="service-item" value="300" onchange="updateAll()"> Charrette Famille : 300€</label><br><input type="datetime-local" class="service-date"></div>
            <div class="service-row"><label><input type="checkbox" class="service-item" value="240" onchange="updateAll()"> Kayak/Paddle Couple : 240€</label><br><input type="datetime-local" class="service-date"></div>
            <div class="service-row"><label><input type="checkbox" class="service-item" value="400" onchange="updateAll()"> Kayak/Paddle Famille : 400€</label><br><input type="datetime-local" class="service-date"></div>
            <div class="service-row">
                <label><input type="checkbox" class="service-item" value="0" onchange="updateAll()"> 🛠 Problème technique (Gratuit)</label><br>
                <input type="datetime-local" class="service-date">
                <textarea class="service-desc" placeholder="Décrivez votre problème ici..." style="width:100%; margin-top:5px;"></textarea>
            </div>
            <hr><p>Total services : <strong id="services-total">0€</strong></p>
            <button onclick="backToMenu()">⬅ Retour</button>`
    };
    container.innerHTML = data[cat] || "Catégorie non trouvée.";
}


function backToMenu() {
    document.getElementById('chat-content').innerHTML = `
        <strong>Que puis-je faire pour vous ?</strong>
        <div class="chat-options">
            <button onclick="showCategory('services')">🛎️ Nos Services</button>
        </div>`;
}

// Initialisation des écouteurs de base
['date-in', 'date-out', 'pack-select'].forEach(id => {
    document.getElementById(id).addEventListener('change', updateAll);
});

document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    alert("Merci ! Votre demande est enregistrée.");
});
async function sendServicesRequest() {
    let selectedServices = [];
    const rows = document.querySelectorAll('.service-row');
    
    rows.forEach(row => {
        const checkbox = row.querySelector('.service-item');
        if (checkbox.checked) {
            const serviceName = checkbox.parentElement.innerText.split(':')[0].trim();
            const serviceDate = row.querySelector('.service-date').value || "Date non précisée";
            
            let detail = ` (Date: ${serviceDate})`;
            const descArea = row.querySelector('.service-desc');
            if (descArea && descArea.value) {
                detail += ` - Description: ${descArea.value}`;
            }
            selectedServices.push(`${serviceName}${detail}`);
        }
    });

    if (selectedServices.length === 0) {
        alert("Veuillez sélectionner au moins un service.");
        return;
    }

    // --- ICI ON APPELLE VOTRE WORKER ---
    const workerUrl = "https://sarmezconciergerie.willpapo79.workers.dev/"; // Remplacez par votre vraie URL

    try {
        const response = await fetch(workerUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: document.getElementById('email').value || "contact@exemple.com",
                date: new Date().toLocaleDateString(),
                services: selectedServices
            })
        });

        if (response.ok) {
            alert("Demande envoyée avec succès !");
        } else {
            alert("Erreur lors de l'envoi.");
        }
    } catch (error) {
        console.error("Erreur:", error);
        alert("Impossible de contacter le serveur.");
    }
}
    

    const message = "Services demandés :\n" + selectedServices.join("\n");
    window.location.href = `mailto:votre-email@exemple.com?subject=Demande de services Sarmèz&body=${encodeURIComponent(message)}`;
}
