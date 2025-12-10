let cart = [];

function loadCart() {
    const saved = localStorage.getItem('shoppingCart');
    if (saved) cart = JSON.parse(saved);
}

function renderSummary() {
    const box = document.getElementById('checkoutSummary');
    box.innerHTML = '<h2>Twoje zamówienie</h2>';

    if (cart.length === 0) {
        box.innerHTML += '<p>Koszyk jest pusty.</p>';
        return;
    }

    let total = 0;

    cart.forEach(item => {
        total += item.price;
        box.innerHTML += `
            <div class="checkout-item">
                <strong>${item.title}</strong> – ${item.price.toFixed(2)} PLN
            </div>
        `;
    });

    box.innerHTML += `
        <hr>
        <h3>Suma: ${total.toFixed(2)} PLN</h3>
    `;
}

document.getElementById('checkoutForm').addEventListener('submit', function(e) {
    e.preventDefault();

    alert("Dziękujemy! Zamówienie zostało złożone.");

    // wyczyść koszyk
    localStorage.removeItem('shoppingCart');

    // przekierowanie
    window.location.href = "index.html";
});

loadCart();
renderSummary();
