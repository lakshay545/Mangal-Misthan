// Configuration
const yourMobileNumber = "919896009903";
const shopLocation = { lat: 28.18, lng: 76.62 }; // Katla Bazar, Rewari
const baseDeliveryCharge = 30; // ₹30 for under 5km
const perKmCharge = 15; // ₹15 per additional km

const sweets = [
    { name: "Gulab Jamun", description: "Soft and juicy, dipped in sugar syrup.", price: 31, image: "gulab-jamun.jpg" },
    { name: "Rasgulla", description: "Spongy and sweet, a Bengali delight.", price: 28, image: "rasgulla.jpg" },
    { name: "Jalebi", description: "Crispy and syrupy, perfect for any occasion.", price: 35, image: "jalebi.jpg" },
    { name: "kaju_katli", description: "Soft and juicy, dipped in sugar syrup.", price: 31, image: "kaju-katli.jpg" },
    { name: "dry-fruits-ladoo", description: "Spongy and sweet, a Bengali delight.", price: 28, image: "dry-fruits-ladoo.webp" },
    { name: "milk-cake", description: "Crispy and syrupy, perfect for any occasion.", price: 35, image: "milk-cake.webp" },
    { name: "dhoda-barfi", description: "Soft and juicy, dipped in sugar syrup.", price: 31, image: "dhoda-barfi.jpg" },
    { name: "kaju-pista", description: "Spongy and sweet, a Bengali delight.", price: 28, image: "kaju-pista-roll.webp" },
    { name: "coconut-barfi", description: "Crispy and syrupy, perfect for any occasion.", price: 35, image: "coconut-barfi.jpg" },
    { name: "besan-laddoo", description: "Soft and juicy, dipped in sugar syrup.", price: 31, image: "Besan-Laddoo.webp" },
    { name: "chocolate-barfi", description: "Spongy and sweet, a Bengali delight.", price: 28, image: "Chocolate-Burfi.webp" },
    { name: "badam-katli", description: "Crispy and syrupy, perfect for any occasion.", price: 35, image: "Badam-Katli.jpg" },
    { name: "khoya-gujiya", description: "Crispy and syrupy, perfect for any occasion.", price: 35, image: "Maida-Gujiya (1).webp" },
    { name: "kesar-modak", description: "Crispy and syrupy, perfect for any occasion.", price: 35, image: "kesar-modak.webp" },
    { name: " Malai Ghewar", description: "Crispy and juicy malai ghewar", price: 400, image: "khoya-ghewar.jpg" },
    { name: "Ghewar without malai coating", description: "Crispy and juicy malai ghewar", price: 400, image: "simple-ghewar.jpeg" },
    { name: "Malai Sandwhich", description: "Crispy and juicy malai ghewar", price: 400, image: "MalaiSandwich.jpg" },
    { name: "Sweet Paan", description: "Crispy and juicy malai ghewar", price: 400, image: "Chhena-paan-scaled.jpg" },
    { name: "Malai peda", description: "Crispy and juicy malai ghewar", price: 400, image: "Malai_peda.jpg" },
];

// Global Variables
let cart = [];
let map;
let marker;
let sliderCurrentSlide = 0;
let slideInterval;
let distance = 0;
let deliveryCharge = 0;

// DOM Elements
const elements = {
    menuItems: document.getElementById('menu-items'),
    cartItems: document.getElementById('cart-items'),
    cartCount: document.getElementById('cart-count'),
    cartTotal: document.getElementById('cart-total-price'),
    gstAmount: document.getElementById('gst-amount'),
    deliveryCharge: document.getElementById('delivery-charge'),
    grandTotal: document.getElementById('grand-total'),
    checkoutItems: document.getElementById('checkout-items'),
    checkoutSubtotal: document.getElementById('checkout-subtotal'),
    checkoutGst: document.getElementById('checkout-gst'),
    checkoutDelivery: document.getElementById('checkout-delivery-display'),
    checkoutTotal: document.getElementById('checkout-total'),
    searchBar: document.getElementById('searchBar'),
    sweetModal: document.getElementById('sweetModal'),
    checkoutModal: document.getElementById('checkoutModal'),
    paymentModal: document.getElementById('paymentModal'),
    mapContainer: document.getElementById('map-container'),
    distanceDisplay: document.getElementById('distance'),
    checkoutDeliveryCharge: document.getElementById('checkout-delivery'),
    proceedToPayBtn: document.getElementById('proceed-to-pay-btn'),
    proceedToPaymentBtn: document.getElementById('proceed-to-payment-btn'),
    confirmOrderBtn: document.getElementById('confirm-order-btn'),
    paymentSubtotal: document.getElementById('payment-subtotal'),
    paymentGst: document.getElementById('payment-gst'),
    paymentDelivery: document.getElementById('payment-delivery'),
    paymentTotal: document.getElementById('payment-total'),
    paymentItems: document.getElementById('payment-items')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    loadMenuItems();
    setupEventListeners();
    showSectionFromHash();
    initSlider();
    
    if (!window.location.hash) {
        showSection('home');
    }
});

// Slider Functions
function initSlider() {
    const slides = document.querySelectorAll('.hero-slider .slide');
    const totalSlides = slides.length;
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        sliderCurrentSlide = (sliderCurrentSlide + 1) % totalSlides;
        showSlide(sliderCurrentSlide);
    }

    // Auto slide every 3 seconds
    slideInterval = setInterval(nextSlide, 3000);
    showSlide(sliderCurrentSlide);
}

// Core Functions
function loadMenuItems() {
    elements.menuItems.innerHTML = '';
    sweets.forEach(sweet => {
        const item = document.createElement('div');
        item.className = 'menu-item';
        item.innerHTML = `
            <img src="${sweet.image}" alt="${sweet.name}">
            <h3>${sweet.name}</h3>
            <p>${sweet.description}</p>
            <p>₹${sweet.price} per piece</p>
            <button class="btn">Add to Cart</button>
        `;
        item.querySelector('button').addEventListener('click', () => openSweetModal(sweet));
        elements.menuItems.appendChild(item);
    });
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
            window.location.hash = sectionId;
        });
    });

    // Modals
    document.querySelectorAll('.modal .close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Sweet Modal
    document.getElementById('quantity').addEventListener('input', updateTotalPrice);
    document.getElementById('add-to-cart-btn').addEventListener('click', addToCartFromModal);

    // Checkout
    elements.proceedToPayBtn.addEventListener('click', openCheckoutModal);
    document.getElementById('current-location-btn').addEventListener('click', useCurrentLocation);
    document.getElementById('map-location-btn').addEventListener('click', showMapInput);
    document.getElementById('search-btn').addEventListener('click', searchLocation);
    elements.proceedToPaymentBtn.addEventListener('click', openPaymentModal);
    elements.confirmOrderBtn.addEventListener('click', submitOrder);

    // Window Events
    window.addEventListener('hashchange', showSectionFromHash);
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// Section Navigation
function showSectionFromHash() {
    const sectionId = window.location.hash.substring(1);
    if (sectionId) showSection(sectionId);
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
        if (sectionId === 'cart') updateCartDisplay();
    } else {
        document.getElementById('home').classList.add('active');
    }
    window.scrollTo(0, 0);
}

// Cart Functions
function openSweetModal(sweet) {
    document.getElementById('modalTitle').textContent = sweet.name;
    document.getElementById('modalDescription').textContent = sweet.description;
    document.getElementById('modalPrice').textContent = `₹${sweet.price} per piece`;
    document.getElementById('quantity').value = 1;
    document.getElementById('totalPrice').textContent = sweet.price;
    elements.sweetModal.style.display = 'flex';
}

function updateTotalPrice() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const price = parseInt(document.getElementById('modalPrice').textContent.replace(/\D/g, ''));
    document.getElementById('totalPrice').textContent = quantity * price;
}

function addToCartFromModal() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const name = document.getElementById('modalTitle').textContent;
    const description = document.getElementById('modalDescription').textContent;
    const price = parseInt(document.getElementById('modalPrice').textContent.replace(/\D/g, ''));
    
    const item = {
        name,
        description,
        price,
        quantity,
        total: price * quantity
    };

    const existingIndex = cart.findIndex(i => i.name === name);
    if (existingIndex >= 0) {
        cart[existingIndex].quantity += quantity;
        cart[existingIndex].total += item.total;
    } else {
        cart.push(item);
    }

    updateCartDisplay();
    elements.sweetModal.style.display = 'none';
}

function updateCartDisplay() {
    elements.cartItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p>Quantity: ${item.quantity}</p>
                <p>Price: ₹${item.total}</p>
            </div>
            <button class="btn">Remove</button>
        `;
        cartItem.querySelector('button').addEventListener('click', () => removeFromCart(index));
        elements.cartItems.appendChild(cartItem);
        subtotal += item.total;
    });

    // Calculate GST (5%)
    const gst = subtotal * 0.05;
    const total = subtotal + gst + deliveryCharge;

    elements.cartCount.textContent = cart.length;
    elements.cartTotal.textContent = subtotal.toFixed(2);
    elements.gstAmount.textContent = gst.toFixed(2);
    elements.deliveryCharge.textContent = deliveryCharge.toFixed(2);
    elements.grandTotal.textContent = total.toFixed(2);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Checkout Functions
function openCheckoutModal() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    elements.checkoutItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'checkout-item';
        div.innerHTML = `<p>${item.name} (${item.quantity} x ₹${item.price}) = ₹${item.total}</p>`;
        elements.checkoutItems.appendChild(div);
        subtotal += item.total;
    });

    // Calculate GST (5%)
    const gst = subtotal * 0.05;
    const total = subtotal + gst + deliveryCharge;

    elements.checkoutSubtotal.textContent = subtotal.toFixed(2);
    elements.checkoutGst.textContent = gst.toFixed(2);
    elements.checkoutDelivery.textContent = deliveryCharge.toFixed(2);
    elements.checkoutTotal.textContent = total.toFixed(2);
    
    elements.checkoutModal.style.display = 'flex';
}

// Location Functions
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in km
}

function calculateDeliveryCharge(distanceKm) {
    if (distanceKm <= 5) return baseDeliveryCharge;
    return baseDeliveryCharge + (Math.ceil(distanceKm - 5) * perKmCharge);
}

function initMap() {
    map = L.map('map').setView([shopLocation.lat, shopLocation.lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    
    // Add shop location marker
    L.marker([shopLocation.lat, shopLocation.lng], {
        icon: L.icon({
            iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        })
    }).addTo(map)
    .bindPopup("Our Shop: Katla Bazar, Rewari");
    
    // Add customer marker
    marker = L.marker([shopLocation.lat, shopLocation.lng], {
        draggable: true,
        icon: L.icon({
            iconUrl: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        })
    }).addTo(map)
    .bindPopup("Drag to adjust your location");
    
    marker.on('dragend', updateAddressFromMarker);
    map.on('click', function(e) {
        marker.setLatLng(e.latlng);
        updateAddressFromMarker();
    });
}

function updateAddressFromMarker() {
    const latlng = marker.getLatLng();
    document.getElementById('customerLat').value = latlng.lat;
    document.getElementById('customerLng').value = latlng.lng;
    
    // Calculate distance from shop
    distance = calculateDistance(latlng.lat, latlng.lng, shopLocation.lat, shopLocation.lng);
    deliveryCharge = calculateDeliveryCharge(distance);
    elements.distanceDisplay.textContent = distance.toFixed(2) + " km";
    elements.checkoutDeliveryCharge.textContent = deliveryCharge.toFixed(2);
    
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('selected-address').textContent = data.display_name || "Address not found";
            updateCartDisplay();
        });
}

function useCurrentLocation() {
    if (!navigator.geolocation) {
        alert("Geolocation not supported by your browser");
        return;
    }

    document.getElementById('selected-address').textContent = "Detecting your location...";
    elements.mapContainer.style.display = 'block';
    if (!map) initMap();

    navigator.geolocation.getCurrentPosition(
        position => {
            const latlng = [position.coords.latitude, position.coords.longitude];
            map.setView(latlng, 16);
            marker.setLatLng(latlng);
            updateAddressFromMarker();
        },
        error => {
            alert("Could not get your location: " + error.message);
        }
    );
}

function showMapInput() {
    elements.mapContainer.style.display = 'block';
    if (!map) initMap();
}

function searchLocation() {
    const query = document.getElementById('locationSearch').value;
    if (!query) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const latlng = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
                map.setView(latlng, 16);
                marker.setLatLng(latlng);
                document.getElementById('selected-address').textContent = data[0].display_name;
                document.getElementById('customerLat').value = latlng[0];
                document.getElementById('customerLng').value = latlng[1];
                updateAddressFromMarker();
            } else {
                alert("Location not found");
            }
        });
}

// Payment Functions
function openPaymentModal() {
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const lat = document.getElementById('customerLat').value;
    const lng = document.getElementById('customerLng').value;
    const address = document.getElementById('selected-address').textContent;

    if (!name || !phone || !lat || !lng || address === "Not selected") {
        alert("Please fill all required fields including location!");
        return;
    }

    elements.paymentItems.innerHTML = '';
    let subtotal = 0;

    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'checkout-item';
        div.innerHTML = `<p>${item.name} (${item.quantity} x ₹${item.price}) = ₹${item.total}</p>`;
        elements.paymentItems.appendChild(div);
        subtotal += item.total;
    });

    // Calculate GST (5%)
    const gst = subtotal * 0.05;
    const total = subtotal + gst + deliveryCharge;

    elements.paymentSubtotal.textContent = subtotal.toFixed(2);
    elements.paymentGst.textContent = gst.toFixed(2);
    elements.paymentDelivery.textContent = deliveryCharge.toFixed(2);
    elements.paymentTotal.textContent = total.toFixed(2);
    
    elements.checkoutModal.style.display = 'none';
    elements.paymentModal.style.display = 'flex';
}

function submitOrder() {
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const lat = document.getElementById('customerLat').value;
    const lng = document.getElementById('customerLng').value;
    const address = document.getElementById('selected-address').textContent;
    const instructions = document.getElementById('specialInstructions').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    if (!name || !phone || !lat || !lng || address === "Not selected") {
        alert("Please fill all required fields including location!");
        return;
    }

    let orderSummary = `New Order from ${name}\nPhone: ${phone}\n\nOrder Details:\n`;
    let subtotal = 0;

    cart.forEach(item => {
        orderSummary += `${item.name} - ${item.quantity} x ₹${item.price} = ₹${item.total}\n`;
        subtotal += item.total;
    });

    // Calculate GST (5%)
    const gst = subtotal * 0.05;
    const total = subtotal + gst + deliveryCharge;

    orderSummary += `\nSubtotal: ₹${subtotal.toFixed(2)}`;
    orderSummary += `\nGST (5%): ₹${gst.toFixed(2)}`;
    orderSummary += `\nDelivery Charge: ₹${deliveryCharge.toFixed(2)}`;
    orderSummary += `\nTotal: ₹${total.toFixed(2)}`;
    orderSummary += `\nPayment Method: ${paymentMethod}`;
    
    const mapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
    orderSummary += `\n\nDelivery Location:\n${address}\nDistance: ${distance.toFixed(2)} km\nGoogle Maps: ${mapsLink}`;

    if (instructions) {
        orderSummary += `\n\nSpecial Instructions:\n${instructions}`;
    }

    window.open(`https://wa.me/${yourMobileNumber}?text=${encodeURIComponent(orderSummary)}`, '_blank');
    
    cart = [];
    updateCartDisplay();
    elements.paymentModal.style.display = 'none';
    alert("Order placed successfully! We'll contact you soon.");
}