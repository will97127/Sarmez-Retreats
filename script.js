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

// --- ENVOI DES DONNÉES EMAILJS ---
function sendServicesRequest() {
    // 1. Récupération des valeurs
    const firstName = document.getElementById('client-firstname').value;
    const lastName = document.getElementById('client-lastname').value;
    const emailClient = document.getElementById('email').value;
    const bungalow = document.getElementById('bungalow').value;
    const totalFinal = document.getElementById('display-total-final').innerText;
    
    // Récupération du nom du pack sélectionné (texte de l'option)
    const packSelect = document.getElementById('pack-select');
    const packName = packSelect.options[packSelect.selectedIndex].text;

    // 2. Préparation des paramètres
    const templateParams = {
        client_name: `${firstName} ${lastName}`,
        client_email: emailClient,
        bungalow: bungalow,
        pack_choisi: packName,
        total_final: totalFinal,
        message: "Récapitulatif de votre demande de réservation Sarmèz Retreats."
    };

    // 3. Envoi des deux emails
    const serviceID = "service_8chuqsf";
    
    // Mail pour VOUS (Gestionnaire)
    emailjs.send(serviceID, "template_ip31gnr", templateParams);

    // Mail pour le CLIENT
    emailjs.send(serviceID, "template_7m5glbl", templateParams)
        .then(() => {
            alert("Merci ! Votre demande a été envoyée. Vous recevrez un récapitulatif par email.");
        }, (err) => {
            alert("Erreur lors de l'envoi : " + JSON.stringify(err));
        });
}

// --- INITIALISATION ---
document.addEventListener('DOMContentLoaded', () => {
    ['date-in', 'date-out', 'pack-select', 'bungalow'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updateAll);
    });
});
