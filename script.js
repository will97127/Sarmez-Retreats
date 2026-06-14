// --- CALCULS EN TEMPS RÉEL ---
function updateAll() {
    // Calcul des nuits (votre logique existante)
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

    // Calcul du pack
    const packSelect = document.getElementById('pack-select');
    const packPrice = parseInt(packSelect.value) || 0;
    document.getElementById('pack-total').innerText = packPrice;

    // Calcul des services
    let totalServices = 0;
    document.querySelectorAll('.service-item:checked').forEach((item) => {
        totalServices += parseFloat(item.value);
    });
    document.getElementById('services-total').innerText = totalServices + "€";

    // Total final
    const grandTotal = nightPrice + packPrice + totalServices;
    document.getElementById('display-total-final').innerText = grandTotal + "€";
}

// --- ENVOI DES DONNÉES ---
function sendServicesRequest() {
    // 1. Récupération des données
    const firstName = document.getElementById('client-firstname').value;
    const lastName = document.getElementById('client-lastname').value;
    const emailClient = document.getElementById('email').value;
    const bungalow = document.getElementById('bungalow').value;
    
    // Récupération PROPRE du nom du pack sélectionné
    const packSelect = document.getElementById('pack-select');
    const packName = packSelect.options[packSelect.selectedIndex].text; 
    
    const totalFinal = document.getElementById('display-total-final').innerText;

    // 2. Préparation des paramètres EmailJS
    const templateParams = {
        client_name: `${firstName} ${lastName}`,
        client_email: emailClient,
        bungalow: bungalow,
        pack_choisi: packName, // <--- C'est cette variable qui sera envoyée
        total_final: totalFinal
    };

    // 3. Envoi
    emailjs.send("service_8chuqsf", "template_ip31gnr", templateParams)
        .then(() => {
            alert("Demande envoyée ! Vous allez recevoir un récapitulatif par email.");
        }, (err) => {
            alert("Erreur d'envoi : " + JSON.stringify(err));
        });
}

// Écouteurs d'événements
document.addEventListener('DOMContentLoaded', () => {
    ['date-in', 'date-out', 'pack-select', 'bungalow'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updateAll);
    });
});
