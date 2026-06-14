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
    // 1. Validation du bungalow
    const bungalow = document.getElementById('bungalow').value;
    if (!bungalow) {
        alert("Veuillez sélectionner un bungalow dans la liste.");
        return;
    }

    // 2. Récupération des données
    const firstName = document.getElementById('client-firstname').value;
    const lastName = document.getElementById('client-lastname').value;
    const emailClient = document.getElementById('email').value;
    const totalFinal = document.getElementById('display-total-final').innerText;
    
    // Formatage des dates (YYYY-MM-DD vers DD/MM/YYYY)
    const formatDate = (dateStr) => {
        if (!dateStr) return "Non précisé";
        const [year, month, day] = dateStr.split('-');
        return `${day}/${month}/${year}`;
    };
    const formattedDateIn = formatDate(document.getElementById('date-in').value);
    const formattedDateOut = formatDate(document.getElementById('date-out').value);

    // Récupération propre du nom du pack
    const packSelect = document.getElementById('pack-select');
    const packName = packSelect.options[packSelect.selectedIndex].text;

    // 3. Préparation des paramètres
    const templateParams = {
        client_name: `${firstName} ${lastName}`,
        client_email: emailClient,
        bungalow: bungalow,
        dates: `Du ${formattedDateIn} au ${formattedDateOut}`,
        pack_choisi: packName,
        total_final: totalFinal,
        message: "Récapitulatif de votre demande de réservation Sarmèz Retreats."
    };

    // 4. Envoi des emails
    const serviceID = "service_8chuqsf";
    
    // Mail pour vous (gestionnaire)
    emailjs.send(serviceID, "template_ip31gnr", templateParams);

    // Mail pour le client
    emailjs.send(serviceID, "template_7m5glbl", templateParams)
        .then(() => {
            alert("Merci ! Votre demande a été envoyée avec succès.");
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
