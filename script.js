// --- LOGIQUE CHATBOT ---
function toggleChat() {
    const chatBody = document.getElementById('chat-body');
    chatBody?.classList.toggle('open');
}

function backToMenu() {
    document.getElementById('chat-content').innerHTML = `
        <strong>Que puis-je faire pour vous ?</strong>
        <div class="chat-options">
            <button type="button" onclick="showCategory('services')">🛎️ Nos Services</button>
        </div>`;
}

function renderService(name, price) {
    // Notez l'ajout d'un ID unique ou d'une structure pour mieux cibler
    return `
        <div class="service-row" style="margin-bottom:15px; border-bottom:1px solid #ddd; padding-bottom:10px;">
            <label style="display:block; margin-bottom:5px;">
                <input type="checkbox" class="service-item" value="${price}" onchange="updateAll()"> 
                <strong>${name}</strong> - ${price}€
            </label>
            <input type="datetime-local" class="service-date" style="width:100%; padding:5px;">
        </div>`;
}

function showCategory(cat) {
    const container = document.getElementById('chat-content');
    container.innerHTML = `
        <button onclick="backToMenu()" style="margin-bottom:10px;">⬅ Retour</button>
        <strong>Sélectionnez vos services :</strong><br><br>
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
            <input type="datetime-local" class="service-date" style="width:100%; margin-top:5px;"><br>
            <textarea class="service-desc" placeholder="Décrivez votre problème" style="width:100%; margin-top:5px;"></textarea>
        </div>
        <p>Total services : <strong id="services-total">0€</strong></p>
    `;
}

function updateAll() {
    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach(item => totalServices += parseFloat(item.value));
    document.getElementById('services-total').innerText = totalServices + "€";
    
    // Mise à jour du total final global
    const nightPrice = parseInt(document.getElementById('night-total')?.innerText) || 0;
    const packPrice = parseInt(document.getElementById('pack-total')?.innerText) || 0;
    document.getElementById('display-total-final').innerText = (nightPrice + packPrice + totalServices) + "€";
}

function sendServicesRequest() {
    // On force la lecture de CHAQUE ligne de service
    let detailsServices = [];
    document.querySelectorAll('.service-row').forEach(row => {
        const checkbox = row.querySelector('.service-item');
        if (checkbox && checkbox.checked) {
            const date = row.querySelector('.service-date').value || "Date non définie";
            const desc = row.querySelector('.service-desc')?.value || "";
            const name = checkbox.parentElement.innerText.split('-')[0].trim();
            detailsServices.push(`${name} [Date: ${date}] ${desc ? '- ' + desc : ''}`);
        }
    });

    const templateParams = {
        client_name: document.getElementById('client-firstname').value + ' ' + document.getElementById('client-lastname').value,
        client_email: document.getElementById('email').value,
        liste_services: detailsServices.length > 0 ? detailsServices.join(" | ") : "Aucun service",
        total_final: document.getElementById('display-total-final').innerText
        // ... ajoutez ici vos autres champs bungalow, dates, etc.
    };

    emailjs.send("service_8chuqsf", "template_ip31gnr", templateParams)
        .then(() => alert("Demande envoyée !"));
}
