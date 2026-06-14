// --- LOGIQUE CHATBOT ---
function toggleChat() {
    const chatBody = document.getElementById('chat-body');
    chatBody?.classList.toggle('open');
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
            <input type="text" id="chat-name" placeholder="Nom" style="width:100%; margin-bottom:5px; padding:5px;">
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
            <button type="button" onclick="sendServicesRequest()" style="width:100%; background:#28a745; color:white; padding:12px; border:none; cursor:pointer; font-weight:bold;">
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
    let detailsServices = [];
    
    document.querySelectorAll('.service-row').forEach(row => {
        const checkbox = row.querySelector('.service-item');
        if (checkbox && checkbox.checked) {
            // Lecture forcée de la valeur brute dans l'input
            const dateInput = row.querySelector('.service-date');
            const rawDate = dateInput ? dateInput.value : "";
            
            // Formatage manuel pour être sûr que ça passe
            let dateFormatted = "Non précisée";
            if (rawDate) {
                const parts = rawDate.split('T');
                const d = parts[0].split('-');
                dateFormatted = `${d[2]}/${d[1]}/${d[0]} à ${parts[1]}`;
            }
            
            const desc = row.querySelector('.service-desc')?.value || "";
            const name = checkbox.parentElement.innerText.split('-')[0].trim();
            
            detailsServices.push(`${name} [Date: ${dateFormatted}] ${desc ? '- ' + desc : ''}`);
        }
    });

    const templateParams = {
        client_name: document.getElementById('chat-name')?.value || "Non renseigné",
        client_email: document.getElementById('chat-email')?.value || "Non renseigné",
        liste_services: detailsServices.length > 0 ? detailsServices.join(" | ") : "Aucun service sélectionné",
        total_final: document.getElementById('services-total')?.innerText || '0€'
    };

    // Envoi
    emailjs.send("service_8chuqsf", "template_ip31gnr", templateParams)
        .then(() => {
            alert("Demande envoyée avec succès !");
            backToMenu();
        }, (err) => {
            console.error("Erreur:", err);
            alert("Erreur lors de l'envoi.");
        });
}

document.addEventListener('DOMContentLoaded', backToMenu);
