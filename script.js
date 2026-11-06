
const products = [
    {
        id: 1,
        name: "Samsung Galaxy A55",
        price: 4200000,
        category: "Telefon",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
    },
    {
        id: 2,
        name: "iPhone 15 Pro",
        price: 12500000,
        category: "Telefon",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"
    },
    {
        id: 3,
        name: "MacBook Air",
        price: 14500000,
        category: "Kompyuter",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"
    },
    {
        id: 4,
        name: "Gaming Laptop",
        price: 11500000,
        category: "Kompyuter",
        image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500"
    },
    {
        id: 5,
        name: "Erkaklar futbolkasi",
        price: 120000,
        category: "Kiyim",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
    },
    {
        id: 6,
        name: "Sport oyoq kiyimi",
        price: 350000,
        category: "Kiyim",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
    },
    {
        id: 7,
        name: "Simsiz quloqchin",
        price: 250000,
        category: "Aksessuar",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    },
    {
        id: 8,
        name: "Smart Watch",
        price: 650000,
        category: "Aksessuar",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
    },
    {
        id: 9,
        name: "Televizor",
        price: 3500000,
        category: "Maishiy texnika",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500"
    },
    {
        id: 10,
        name: "Zamonaviy kamera",
        price: 2200000,
        category: "Aksessuar",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500"
    }
];

let cart = JSON.parse(localStorage.getItem("yakkaCart")) || [];
let favorites = JSON.parse(localStorage.getItem("yakkaFavorites")) || [];
let currentProducts = [...products];

const productList = document.getElementById("productList");

function formatPrice(price) {
    return price.toLocaleString("uz-UZ") + " so'm";
}

function saveData() {
    localStorage.setItem("yakkaCart", JSON.stringify(cart));
    localStorage.setItem("yakkaFavorites", JSON.stringify(favorites));
}

function renderProducts(list) {
    currentProducts = [...list];

    productList.innerHTML = "";

    if (list.length === 0) {
        productList.innerHTML = "<p>Mahsulot topilmadi!</p>";
        return;
    }

    list.forEach(product => {
        const isFavorite = favorites.includes(product.id);

        productList.innerHTML += `
            <div class="product">
                <button class="favorite"
                    onclick="toggleFavorite(${product.id})">
                    ${isFavorite ? "♥" : "♡"}
                </button>

                <img src="${product.image}"
                     alt="${product.name}"
                     loading="lazy">

                <h3>${product.name}</h3>

                <p>${product.category}</p>

                <div class="price">
                    ${formatPrice(product.price)}
                </div>

                <button onclick="addToCart(${product.id})">
                    🛒 Savatchaga
                </button>
            </div>
        `;
    });
}

function searchProducts() {
    const value = document.getElementById("searchInput")
        .value.toLowerCase().trim();

    const result = products.filter(product =>
        product.name.toLowerCase().includes(value)
    );

    document.getElementById("sectionTitle").textContent =
        "Qidiruv natijalari";

    renderProducts(result);
}

document.getElementById("searchInput")
    .addEventListener("input", searchProducts);

function filterCategory(category) {
    document.getElementById("sectionTitle").textContent =
        category === "Barchasi" ? "Mashhur mahsulotlar" : category;

    const result = category === "Barchasi"
        ? products
        : products.filter(p => p.category === category);

    renderProducts(result);
}

function sortProducts() {
    const value = document.getElementById("sortSelect").value;

    let sorted = [...currentProducts];

    if (value === "cheap") {
        sorted.sort((a, b) => a.price - b.price);
    }

    if (value === "expensive") {
        sorted.sort((a, b) => b.price - a.price);
    }

    renderProducts(sorted);
}

function addToCart(id) {
    const product = products.find(p => p.id === id);

    const existing = cart.find(p => p.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({...product, quantity: 1});
    }

    saveData();
    updateCart();
    alert("Mahsulot savatchaga qo'shildi!");
}

function updateCart() {
    const count = cart.reduce((sum, p) => sum + p.quantity, 0);

    document.getElementById("cartCount").textContent = count;

    const cartItems = document.getElementById("cartItems");

    cartItems.innerHTML = "";

    cart.forEach(product => {
        cartItems.innerHTML += `
            <div class="cart-item">
                <div>
                    <strong>${product.name}</strong>
                    <p>${formatPrice(product.price)}</p>
                </div>

                <div>
                    <button onclick="changeQuantity(${product.id}, -1)">−</button>
                    ${product.quantity}
                    <button onclick="changeQuantity(${product.id}, 1)">+</button>
                    <button onclick="removeFromCart(${product.id})">🗑️</button>
                </div>
            </div>
        `;
    });

    const total = cart.reduce(
        (sum, p) => sum + p.price * p.quantity, 0
    );

    document.getElementById("totalPrice").textContent =
        "Jami: " + formatPrice(total);
}

function changeQuantity(id, amount) {
    const item = cart.find(p => p.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }

    saveData();
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(p => p.id !== id);
    saveData();
    updateCart();
}

function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(item => item !== id);
    } else {
        favorites.push(id);
    }

    saveData();
    renderProducts(currentProducts);
}

function showFavorites() {
    const favoriteProducts = products.filter(p =>
        favorites.includes(p.id)
    );

    document.getElementById("sectionTitle").textContent =
        "Sevimli mahsulotlar";

    renderProducts(favoriteProducts);

    document.getElementById("products").scrollIntoView();
}

function showCart() {
    document.getElementById("cartSection").style.display = "block";
}

function hideCart() {
    document.getElementById("cartSection").style.display = "none";
}

function checkout() {
    if (cart.length === 0) {
        alert("Savatchangiz bo'sh!");
        return;
    }

    hideCart();

    document.getElementById("orderSection").style.display = "block";
}

function closeOrder() {
    document.getElementById("orderSection").style.display = "none";
}

function placeOrder() {
    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const address = document.getElementById("customerAddress").value.trim();

    if (!name || !phone || !address) {
        alert("Iltimos, barcha ma'lumotlarni kiriting!");
        return;
    }

    if (!/^\+?[0-9\s()-]{9,18}$/.test(phone)) {
        alert("Telefon raqamini to'g'ri kiriting!");
        return;
    }

    const order = {
        name,
        phone,
        address,
        products: cart,
        date: new Date().toISOString()
    };

    const orders = JSON.parse(
        localStorage.getItem("yakkaOrders") || "[]"
    );

    orders.push(order);

    localStorage.setItem("yakkaOrders", JSON.stringify(orders));

    alert("Buyurtmangiz qabul qilindi! Rahmat.");

    cart = [];
    saveData();
    updateCart();
    closeOrder();

    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerAddress").value = "";
}

// Sayt ishga tushishi
renderProducts(products);
updateCart();
