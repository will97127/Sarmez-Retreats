// --- LOGIQUE CHATBOT ---
function toggleChat() {
    const chatBody = document.getElementById('chat-body');
    const icon = document.getElementById('chat-icon');
    if (chatBody) {
        chatBody.classList.toggle('open');
        if (icon) {
            icon.classList.toggle('fa-chevron-up');
            icon.classList.toggle('fa-chevron-down');
        }
    }
}

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
    document.getElementById('night-total')&&(document.getElementById('night-total').innerText = nightPrice);

    const packSelect = document.getElementById('pack-select');
    const packPrice = parseInt(packSelect?.value) || 0;
    document.getElementById('pack-total')&&(document.getElementById('pack-total').innerText = packPrice);

    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach(item => totalServices += parseFloat(item.value));
    const servicesDisplay = document.getElementById('services-total');
    if (servicesDisplay) servicesDisplay.innerText = totalServices + "€";

    const grandTotal = nightPrice + packPrice + totalServices;
    document.getElementById('display-total-final')&&(document.getElementById('display-total-final').innerText = grandTotal + "€");
}

// --- ENVOI DES DONNÉES EMAILJS ---
function sendServicesRequest() {
    const bungalow = document.getElementById('bungalow')?.value;
    if (!bungalow) { alert("Veuillez sélectionner un bungalow."); return; }

    const formatDate = (d) => { if(!d) return "Non précisée"; const [y, m, d2] = d.split('-'); return `${d2}/${m}/${y}`; };
    
    const templateParams = {
        client_name: `${document.getElementById('client-firstname')?.value || ''} ${document.getElementById('client-lastname')?.value || ''}`,
        client_email: document.getElementById('email')?.value || '',
        client_phone: document.getElementById('phone')?.value || '',
        bungalow: bungalow,
        dates: `Du ${formatDate(document.getElementById('date-in')?.value)} au ${formatDate(document.getElementById('date-out')?.value)}`,
        pack_choisi: document.getElementById('pack-select')?.options[document.getElementById('pack-select').selectedIndex].text || 'Aucun',
        total_final: document.getElementById('display-total-final')?.innerText || '0€'
    };

    emailjs.send("service_8chuqsf", "template_ip31gnr", templateParams);
    emailjs.send("service_8chuqsf", "template_7m5glbl", templateParams)
        .then(() => alert("Demande envoyée avec succès !"), (err) => alert("Erreur : " + JSON.stringify(err)));
}

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    ['date-in', 'date-out', 'pack-select', 'bungalow'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', updateAll);
    });
});
