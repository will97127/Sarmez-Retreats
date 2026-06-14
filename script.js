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
    // Récupération des éléments
    const packSelect = document.getElementById('pack-select');
    const packName = packSelect.options[packSelect.selectedIndex].getAttribute('data-name') || "Aucun pack";
    const firstName = document.getElementById('client-firstname').value;
    const lastName = document.getElementById('client-lastname').value;
    const clientName = document.getElementById('chat-name')?.value || "Client";
    const emailClient = document.getElementById('chat-email')?.value || document.getElementById('email').value;
    const bungalow = document.getElementById('chat-bungalow')?.value || document.getElementById('bungalow').value;
    const totalFinal = document.getElementById('display-total-final').innerText;
    
    // Récupération des services
    let servicesDetails = [];
    document.querySelectorAll('.service-item:checked').forEach(item => {
        const name = item.parentElement.innerText.split(':')[0].trim();
        servicesDetails.push(name);
    });

    if (!emailClient || !bungalow) {
        alert("Veuillez remplir votre email et choisir un bungalow.");
        return;
    }

    // Paramètres envoyés à EmailJS
    const templateParams = {
        client_name: `${firstName} ${lastName}`,
        client_email: emailClient,
        bungalow: bungalow,
        pack_choisi: packName, // <--- AJOUTÉ : ceci doit correspondre à {{pack_choisi}} dans votre template
        services_list: servicesDetails.length > 0 ? servicesDetails.join(", ") : "Aucun service",
        total_final: totalFinal,
        message: `Récapitulatif de votre réservation pour le bungalow ${bungalow}. Total : ${totalFinal}`
    };

    // Envoi
    emailjs.send("service_8chuqsf", "template_ip31gnr", templateParams)
        .then(() => {
            alert("Merci ! Votre demande a été envoyée. Vous recevrez un récapitulatif par mail.");
        })
        .catch((err) => {
            alert("Erreur lors de l'envoi : " + JSON.stringify(err));
        });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    ['date-in', 'date-out', 'pack-select', 'bungalow'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', updateAll);
    });
});
