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
'services': <strong&gt;Sélectionnez vos services :&lt;/strong&gt;&lt;br&gt; &lt;div class="service-row"&gt;&lt;label&gt;&lt;input type="checkbox" class="service-item" value="15" onchange="updateAll()"&gt; Petit déjeuner : 15€&lt;/label&gt;&lt;br&gt;&lt;input type="datetime-local" class="service-date"&gt;&lt;/div&gt; &lt;div class="service-row"&gt;&lt;label&gt;&lt;input type="checkbox" class="service-item" value="20" onchange="updateAll()"&gt; Ménage : 20€&lt;/label&gt;&lt;br&gt;&lt;input type="datetime-local" class="service-date"&gt;&lt;/div&gt; &lt;div class="service-row"&gt;&lt;label&gt;&lt;input type="checkbox" class="service-item" value="110" onchange="updateAll()"&gt; Massage Solo : 110€&lt;/label&gt;&lt;br&gt;&lt;input type="datetime-local" class="service-date"&gt;&lt;/div&gt; &lt;div class="service-row"&gt;&lt;label&gt;&lt;input type="checkbox" class="service-item" value="180" onchange="updateAll()"&gt; Massage Duo : 180€&lt;/label&gt;&lt;br&gt;&lt;input type="datetime-local" class="service-date"&gt;&lt;/div&gt; &lt;div class="service-row"&gt;&lt;label&gt;&lt;input type="checkbox" class="service-item" value="180" onchange="updateAll()"&gt; Charrette Couple : 180€&lt;/label&gt;&lt;br&gt;&lt;input type="datetime-local" class="service-date"&gt;&lt;/div&gt; &lt;div class="service-row"&gt;&lt;label&gt;&lt;input type="checkbox" class="service-item" value="300" onchange="updateAll()"&gt; Charrette Famille : 300€&lt;/label&gt;&lt;br&gt;&lt;input type="datetime-local" class="service-date"&gt;&lt;/div&gt; &lt;div class="service-row"&gt;&lt;label&gt;&lt;input type="checkbox" class="service-item" value="240" onchange="updateAll()"&gt; Kayak/Paddle Couple : 240€&lt;/label&gt;&lt;br&gt;&lt;input type="datetime-local" class="service-date"&gt;&lt;/div&gt; &lt;div class="service-row"&gt;&lt;label&gt;&lt;input type="checkbox" class="service-item" value="400" onchange="updateAll()"&gt; Kayak/Paddle Famille : 400€&lt;/label&gt;&lt;br&gt;&lt;input type="datetime-local" class="service-date"&gt;&lt;/div&gt; &lt;div class="service-row"&gt; &lt;label&gt;&lt;input type="checkbox" class="service-item" value="0" onchange="updateAll()"&gt; 🛠 Problème technique (Gratuit)&lt;/label&gt;&lt;br&gt; &lt;input type="datetime-local" class="service-date"&gt; &lt;textarea class="service-desc" placeholder="Décrivez votre problème ici..." style="width:100%; margin-top:5px;"&gt;&lt;/textarea&gt; &lt;/div&gt; &lt;hr&gt;&lt;p&gt;Total services : &lt;strong id="services-total"&gt;0€&lt;/strong&gt;&lt;/p&gt; &lt;button onclick="backToMenu()"&gt;⬅ Retour&lt;/button>
};
container.innerHTML = data[cat] || "Catégorie non trouvée.";
}


function backToMenu() {
document.getElementById('chat-content').innerHTML = &lt;strong&gt;Que puis-je faire pour vous ?&lt;/strong&gt; &lt;div class="chat-options"&gt; &lt;button onclick="showCategory('services')"&gt;🛎️ Nos Services&lt;/button&gt; &lt;/div>;
}

// Initialisation des écouteurs de base
['date-in', 'date-out', 'pack-select'].forEach(id => {
document.getElementById(id).addEventListener('change', updateAll);
});

document.getElementById('booking-form').addEventListener('submit', function(e) {
e.preventDefault();
alert("Merci ! Votre demande est enregistrée.");
});
function sendServicesRequest() {
let selectedServices = [];
const rows = document.querySelectorAll('.service-row');

rows.forEach(row => {
const checkbox = row.querySelector('.service-item');
if (checkbox.checked) {
const serviceName = checkbox.parentElement.innerText.split(':')[0].trim();
const serviceDate = row.querySelector('.service-date').value || "Date non précisée";

// Récupération de la description si c'est le problème technique
let detail = (Date: ${serviceDate}); const descArea = row.querySelector('.service-desc'); if (descArea && descArea.value) { detail += - Description: ${descArea.value};
}

selectedServices.push(${serviceName}${detail});
}
});

if (selectedServices.length === 0) {
alert("Veuillez sélectionner au moins un service.");
return;
}

const message = "Services demandés :\n" + selectedServices.join("\n");
window.location.href = mailto:votre-email@exemple.com?subject=Demande de services Sarmèz&body=${encodeURIComponent(message)};
    }
