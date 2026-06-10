// --- FONCTION DE CALCUL UNIFIÉE ---
function updateAll() {
    // 1. Calcul Séjour (200€/nuit)
    const dateIn = new Date(document.getElementById('date-in').value);
    const dateOut = new Date(document.getElementById('date-out').value);
    const diffTime = Math.abs(dateOut - dateIn);
    const nights = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    const nightPrice = nights * 200;

    // 2. Calcul Pack (Sélectionné dans le formulaire)
    const packSelect = document.getElementById('pack-select');
    const packPrice = parseInt(packSelect.value) || 0;

    // 3. Calcul Services (Conciergerie)
    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach((item) => {
        totalServices += parseFloat(item.value);
    });

    // 4. Mise à jour de l'affichage dans le chat
    document.getElementById('services-total').innerText = totalServices + "€";

    // 5. Mise à jour de la barre flottante
    document.getElementById('night-total').innerText = nightPrice;
    document.getElementById('pack-total').innerText = packPrice;
    
    // Total final = Séjour + Pack + Services
    // Note : Votre HTML utilise l'ID "display-total-final"
    const grandTotal = nightPrice + packPrice + totalServices;
    document.getElementById('display-total-final').innerText = grandTotal + "€";
}

// --- INITIALISATION DES ÉCOUTEURS ---
// Écoute les changements sur le formulaire principal
['date-in', 'date-out', 'pack-select'].forEach(id => {
    document.getElementById(id).addEventListener('change', updateAll);
});

// Écoute les changements sur les checkboxes du chat
document.querySelectorAll('.service-item').forEach(item => {
    item.addEventListener('change', updateAll);
});

// --- LOGIQUE CHATBOT ---
function toggleChat() {
    const chatBody = document.getElementById('chat-body');
    const icon = document.getElementById('chat-icon');
    chatBody.classList.toggle('open');
    icon.classList.toggle('fa-chevron-up');
    icon.classList.toggle('fa-chevron-down');
}

function sendServicesRequest() {
    const selected = [];
    document.querySelectorAll('.service-item:checked').forEach((cb) => {
        selected.push(cb.parentElement.innerText.trim());
    });
    alert("Demande envoyée pour : " + (selected.length > 0 ? selected.join(', ') : "aucun service"));
}

// Soumission du formulaire global
document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    alert("Merci ! Votre demande est enregistrée. Total final : " + document.getElementById('display-total-final').innerText);
});
