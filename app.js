(function () {
    // --- BAZA DANYCH KSIĄŻEK ---
    

    const coverBase = "https://placehold.co/300x450";
    
    // Kolory kategorii (Hex)
    const cKlasyka = "3e2723"; // Ciemny brąz
    const cKryminal = "1f2937"; // Ciemny grafit
    const cFantastyka = "1e3a8a"; // Ciemny granat 
    const cRozwoj = "064e3b"; // Butelkowa zieleń
    const cNaukowe = "4c1d95"; // Głęboki fiolet
    const textCol = "e5e7eb"; // Jasny szary tekst
    let books =[];


    let cart = [];

    // --- DOM Elements ---
    const grid = document.getElementById('booksGrid');
    const homePage = document.getElementById('homePage');
    const productPage = document.getElementById('productPage');
    const cartCount = document.getElementById('cartCount');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');

    function loadBooks() {
    return fetch("books.json")
        .then(res => res.json())
        .then(data => {
            books = data;
            renderGrid(books);
            checkUrl();
        })
        .catch(err => console.error("Błąd wczytywania books.json:", err));
}

    // --- PERSISTENCE ---
    function loadCart() {
        try {
            const saved = localStorage.getItem('shoppingCart');
            if (saved) {
                cart = JSON.parse(saved);
                renderCart(); 
            }
        } catch (e) {
            console.error('Błąd koszyka', e);
            cart = [];
        }
    }

    function saveCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        renderCart();
    }

    // --- ROUTING ---
    function checkUrl() {
        const params = new URLSearchParams(window.location.search);
        const bookId = params.get('id');

        if (bookId) {
            renderProductPage(parseInt(bookId));
        } else {
            renderHomePage();
        }
    }

    // --- RENDERING ---
    function renderHomePage() {
        homePage.classList.remove('hidden');
        productPage.classList.add('hidden');
        if (grid.innerHTML === '') {
            renderGrid(books);
        }
        window.scrollTo(0, 0);
    }

    function renderProductPage(id) {
        const book = books.find(b => b.id === id);

        if (!book) {
            window.history.pushState({}, '', 'index.html');
            renderHomePage();
            return;
        }

        homePage.classList.add('hidden');
        productPage.classList.remove('hidden');

        const isInCart = cart.some(item => item.id === book.id);

        productPage.innerHTML = `
            <a href="index.html" class="back-link" onclick="app.goHome(event)">← Wróć do katalogu</a>
            <div class="product-detail-view">
                <img src="${book.cover}" class="detail-img">
                <div class="detail-info">
                    <div style="font-size:0.9rem;color:#888;text-transform:uppercase;margin-bottom:10px;">
                        ${formatCategory(book.category)}
                    </div>
                    <h1 class="detail-title">${book.title}</h1>
                    <p class="detail-author">Autor: ${book.author}</p>
                    <span class="detail-price">${book.price.toFixed(2)} PLN</span>
                    <button class="btn-yellow" onclick="app.addToCart(${book.id})">
                        ${isInCart ? 'W KOSZYKU' : 'DODAJ DO KOSZYKA'}
                    </button>
                    <div class="detail-desc">
                        <h3>Opis produktu</h3>
                        <p>${book.desc}</p>
                        <p style="color:#666; font-size:0.9rem; margin-top:20px;">
                            ISBN: 978-83-${Math.floor(Math.random()*1000000)}<br>
                            Okładka: Twarda<br>
                            Rok wydania: 2023-2024
                        </p>
                    </div>
                </div>
            </div>
        `;
        window.scrollTo(0, 0);
    }

    function renderGrid(list) {
        grid.innerHTML = '';
        if (list.length === 0) {
            grid.innerHTML = '<p style="text-align:center; width:100%;">Brak książek w tej kategorii.</p>';
            return;
        }

        list.forEach(b => {
            const el = document.createElement('div');
            el.className = 'card';

            el.innerHTML = `
                <a href="?id=${b.id}" onclick="app.goToProduct(event, ${b.id})">
                    <img src="${b.cover}" alt="${b.title}" loading="lazy">
                </a>
                <div class="card-content">
                    <div class="card-cat">${formatCategory(b.category)}</div>
                    <a href="?id=${b.id}" onclick="app.goToProduct(event, ${b.id})">
                        <h3>${b.title}</h3>
                    </a>
                    <div class="card-author">${b.author}</div>
                    <span class="card-price">${b.price.toFixed(2)} PLN</span>
                    <button class="btn-cart" onclick="app.addToCart(${b.id})">DO KOSZYKA</button>
                </div>
            `;
            grid.appendChild(el);
        });
    }

    function renderCart() {
        cartCount.innerText = cart.length;
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Koszyk jest pusty</p>';
            return;
        }

        let total = 0;
        cart.forEach(item => {
            total += item.price;
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <img src="${item.cover}">
                <div>
                    <strong>${item.title}</strong>
                    <br>${item.price.toFixed(2)} PLN
                    <br><button onclick="app.removeFromCart(${item.id})" style="color:red;border:none;background:none;cursor:pointer;padding:0;font-size:0.8rem">Usuń</button>
                </div>
            `;
            cartItemsContainer.appendChild(el);
        });

        const bottomCheckoutBtn = document.getElementById('checkoutBtn');
        if (bottomCheckoutBtn) {
            bottomCheckoutBtn.addEventListener('click', () => {
            window.location.href = 'checkout.html';
    });
}

    
    }

    function formatCategory(cat) {
        const map = {
            'klasyka': 'Klasyka Literatury',
            'kryminal': 'Kryminał i Sensacja',
            'fantastyczna': 'Fantastyka',
            'rozwoj': 'Rozwój Osobisty',
            'naukowe': 'Literatura Naukowa'
        };
        return map[cat] || cat;
    }

    // --- GLOBALNE FUNKCJE ---
    window.app = {
        goToProduct: function (e, id) {
            e.preventDefault();
            window.history.pushState({ id: id }, '', `?id=${id}`);
            renderProductPage(id);
        },

        goHome: function (e) {
            e.preventDefault();
            window.history.pushState({}, '', 'index.html');
            renderHomePage();
        },

        addToCart: function (id) {
            if (cart.some(i => i.id === id)) return;
            const book = books.find(b => b.id === id);
            cart.push(book);
            saveCart();
            
            document.getElementById('cartSidebar').classList.add('open');
            document.getElementById('cartOverlay').classList.remove('hidden');
            
            // Odśwież widok przycisku jeśli jesteśmy na stronie produktu
            const params = new URLSearchParams(window.location.search);
            if (params.get('id') == id) renderProductPage(id);
        },

        removeFromCart: function (id) {
            cart = cart.filter(i => i.id !== id);
            saveCart();
            
            // Odśwież widok przycisku
            const params = new URLSearchParams(window.location.search);
            if (params.get('id')) renderProductPage(parseInt(params.get('id')));
        },

        toggleCart: function () {
            cartSidebar.classList.toggle('open');
            cartOverlay.classList.toggle('hidden');
        },

        filterBooks: function(category) {
            // Obsługa klas aktywnych
            const btns = document.querySelectorAll('.filter-btn');
            btns.forEach(b => b.classList.remove('active'));

            const activeBtn = Array.from(btns).find(b => b.getAttribute('onclick').includes(category));
            if(activeBtn) activeBtn.classList.add('active');

            if (category === 'all') {
                renderGrid(books);
            } else {
                const filtered = books.filter(b => b.category === category);
                renderGrid(filtered);
            }
        }
    };

    // --- INIT ---
    window.onpopstate = checkUrl;
    
    document.getElementById('cartBtn').onclick = app.toggleCart;
    document.getElementById('closeCart').onclick = app.toggleCart;
    document.getElementById('cartOverlay').onclick = app.toggleCart;

    document.getElementById('searchBtn').onclick = () => {
        const q = document.getElementById('searchInput').value.toLowerCase();
        window.history.pushState({}, '', 'index.html');
        renderHomePage();
        renderGrid(books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)));
    };

    loadCart();
    loadBooks();


})();