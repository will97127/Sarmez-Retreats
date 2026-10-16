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
            <textarea class="service-details" placeholder="Précisez votre date ou demande..." style="width:100%; height:40px; margin-top:5px;"></textarea>
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
                <button t
