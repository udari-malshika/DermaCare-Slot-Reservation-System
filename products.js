const products = [
  {
    id: 1,
    name: "Gentle Foaming Cleanser",
    category: "Cleanser",
    price: 4200,
    rating: 4.8,
    tag: "BESTSELLER",
    skin: ["Oily", "Sensitive", "Combination"],
    description: "A gentle daily cleanser for fresh, balanced skin.",
    image: "Images/Centella cleanser.jpg"
  },
  {
    id: 2,
    name: "Vitamin C Brightening Serum",
    category: "Serum",
    price: 5850,
    rating: 4.9,
    tag: "POPULAR",
    skin: ["Dry", "Oily", "Combination"],
    description: "A lightweight serum for a radiant-looking complexion.",
    image: "Images/Arencia vitemin C.jpg"
  },
  {
    id: 3,
    name: "Hydrating Barrier Cream",
    category: "Moisturizer",
    price: 6400,
    rating: 4.7,
    tag: "NEW",
    skin: ["Dry", "Sensitive"],
    description: "A rich moisturizer to support your skin barrier.",
    image: "Images/345 cream.jpg"
  },
  {
    id: 4,
    name: "Mineral SPF 50 Shield",
    category: "Sunscreen",
    price: 3800,
    rating: 4.6,
    tag: "",
    skin: ["Sensitive", "Dry", "Combination"],
    description: "Daily sun protection for your skincare routine.",
    image: "Images/Ord Moisture.jpg"
  },
  {
    id: 5,
    name: "Advanced Retinol Serum",
    category: "Serum",
    price: 3980,
    rating: 4.5,
    tag: "",
    skin: ["Dry", "Oily", "Combination"],
    description: "A night serum for a smoother-looking complexion.",
    image: "Images/Ord Ratinol.jpg"
  },
  {
    id: 6,
    name: "Daily Hydrating Cleanser",
    category: "Cleanser",
    price: 3200,
    rating: 4.4,
    tag: "",
    skin: ["Dry", "Sensitive"],
    description: "A simple cleanser for a comfortable daily routine.",
    image: "Images/Ord Clens.jpg"
  },
  {
    id: 7,
    name: "Oil Control Moisturizer",
    category: "Moisturizer",
    price: 4500,
    rating: 4.7,
    tag: "POPULAR",
    skin: ["Oily", "Combination"],
    description: "Lightweight hydration without a heavy finish.",
    image: "Images/Medicube Pink cap cream.jpg"
  },
  {
    id: 8,
    name: "Daily Glow Sunscreen",
    category: "Sunscreen",
    price: 3500,
    rating: 4.6,
    tag: "",
    skin: ["Oily", "Dry", "Combination"],
    description: "A daily sunscreen for your morning routine.",
    image: "Images/Ord Moisture.jpg"
  },
  {
    id: 9,
    name: "Soothing Skin Serum",
    category: "Serum",
    price: 5200,
    rating: 4.8,
    tag: "TOP RATED",
    skin: ["Sensitive", "Dry"],
    description: "A gentle-feeling serum for a simple skincare routine.",
    image: "Images/Anua Niasinamide.jpg"
  },
  {
    id: 10,
    name: "Centella Recovery Cream",
    category: "Moisturizer",
    price: 6100,
    rating: 4.8,
    tag: "NEW",
    skin: ["Sensitive", "Dry"],
    description: "Comforting hydration with a soothing, barrier-supporting finish.",
    image: "Images/centella cream.jpg"
  },
  {
    id: 11,
    name: "Green Glow Essence",
    category: "Serum",
    price: 5750,
    rating: 4.9,
    tag: "BESTSELLER",
    skin: ["Oily", "Combination", "Sensitive"],
    description: "A calming, brightening serum for more refreshed-looking skin.",
    image: "Images/Anua Green.jpg"
  },
  {
    id: 12,
    name: "Pore Refining Serum",
    category: "Serum",
    price: 4900,
    rating: 4.7,
    tag: "POPULAR",
    skin: ["Oily", "Combination"],
    description: "Targets texture and dullness for a more refined complexion.",
    image: "Images/Medicube Pink serum.jpg"
  },
  {
    id: 13,
    name: "Barrier Repair Mask",
    category: "Moisturizer",
    price: 4700,
    rating: 4.6,
    tag: "",
    skin: ["Dry", "Sensitive"],
    description: "A deep-hydrating mask for soft, replenished skin after a long day.",
    image: "Images/Biodance mask.jpg"
  },
  {
    id: 14,
    name: "Niacinamide Daily Essence",
    category: "Serum",
    price: 5600,
    rating: 4.8,
    tag: "TOP RATED",
    skin: ["Oily", "Combination", "Sensitive"],
    description: "Helps refine skin tone and support a smoother-looking finish.",
    image: "Images/Ord Niacinamide.jpg"
  }
];

const grid = document.getElementById("productGrid");
const category = document.getElementById("category");
const skinType = document.getElementById("skinType");
const maxPrice = document.getElementById("maxPrice");
const priceValue = document.getElementById("priceValue");
const sortBy = document.getElementById("sortBy");
const resultCount = document.getElementById("resultCount");
const emptyMessage = document.getElementById("emptyMessage");

const CART_KEY = "dermacare-cart";
let cart = [];

function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    if (Array.isArray(stored)) {
      cart = stored;
    }
  } catch (error) {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function renderProducts() {
  const searchTerm = document.getElementById("searchInput")?.value
    .toLowerCase().trim() || "";

  let filtered = products.filter(product => {
    const matchesCategory =
      category.value === "all" ||
      product.category === category.value;

    const matchesSkin =
      skinType.value === "all" ||
      product.skin.includes(skinType.value);

    const matchesPrice =
      product.price <= Number(maxPrice.value);

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSkin &&
      matchesPrice && matchesSearch;
  });

  if (sortBy.value === "low") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === "high") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy.value === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  resultCount.textContent =
    `Showing ${filtered.length} of ${products.length} products`;

  emptyMessage.hidden = filtered.length > 0;

  grid.innerHTML = filtered.map(product => `
    <article class="product-card">
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='https://placehold.co/500x400/f0efff/6558f5?text=DermaCare'">
        ${product.tag ? `<span class="tag">${product.tag}</span>` : ""}
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom">
          <span class="price">LKR ${product.price.toLocaleString("en-LK")}</span>
          <span class="rating">★ ${product.rating}</span>
        </div>
        <button class="add-btn" data-add="${product.id}">
          + Add to Cart
        </button>
      </div>
    </article>
  `).join("");
}

[category, skinType, sortBy].forEach(control => {
  control.addEventListener("change", renderProducts);
});

maxPrice.addEventListener("input", () => {
  priceValue.textContent = Number(maxPrice.value).toLocaleString("en-LK");
  renderProducts();
});

document.getElementById("resetButton").addEventListener("click", () => {
  category.value = "all";
  skinType.value = "all";
  maxPrice.value = "10000";
  priceValue.textContent = "10000";
  sortBy.value = "popular";

  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";

  renderProducts();
});

// Add products to the demo shopping cart
grid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  const id = Number(button.dataset.add);
  const product = products.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCart();
  button.textContent = "✓ Added to Cart";
  setTimeout(() => {
    button.textContent = "+ Add to Cart";
  }, 900);
});

function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.getElementById("cartCount").textContent = count;

  document.getElementById("cartItems").innerHTML = cart.length
    ? cart.map(item => `
      <div class="cart-line">
        <strong>${item.name}</strong>
        <p>Quantity: ${item.quantity} × LKR ${item.price.toLocaleString("en-LK")}</p>
        <button data-remove="${item.id}">Remove one</button>
      </div>
    `).join("")
    : "<p>Your cart is empty. Add a product to get started!</p>";

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  document.getElementById("cartTotal").textContent =
    `Total: LKR ${total.toLocaleString("en-LK")}`;

  const checkoutButton = document.getElementById("checkoutBtn");
  if (checkoutButton) {
    checkoutButton.disabled = cart.length === 0;
    checkoutButton.style.opacity = cart.length === 0 ? "0.5" : "1";
  }

  saveCart();
}

document.getElementById("cartItems").addEventListener("click", event => {
  const button = event.target.closest("[data-remove]");
  if (!button) return;

  const id = Number(button.dataset.remove);
  const item = cart.find(product => product.id === id);

  if (item) {
    item.quantity--;
    if (item.quantity <= 0) {
      cart = cart.filter(product => product.id !== id);
    }
  }

  updateCart();
});

const cartModal = document.getElementById("cartModal");
const checkoutBtn = document.getElementById("checkoutBtn");

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    if (!cart.length) return;
    cartModal.hidden = true;
    window.location.href = "payment.html";
  });
}

document.getElementById("cartButton").addEventListener("click", () => {
  cartModal.hidden = false;
});

document.getElementById("closeCart").addEventListener("click", () => {
  cartModal.hidden = true;
});

// Skin quiz
const quizModal = document.getElementById("quizModal");

document.getElementById("quizButton").addEventListener("click", () => {
  quizModal.hidden = false;
});

document.getElementById("closeQuiz").addEventListener("click", () => {
  quizModal.hidden = true;
});

document.getElementById("findProducts").addEventListener("click", () => {
  skinType.value = document.getElementById("quizSkin").value;
  quizModal.hidden = true;
  renderProducts();

  document.querySelector(".catalog").scrollIntoView({
    behavior: "smooth"
  });
});

// Close a modal by clicking outside its content
[quizModal, cartModal].forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) modal.hidden = true;
  });
});

// Search field added to the catalog heading
const search = document.createElement("input");
search.id = "searchInput";
search.type = "search";
search.placeholder = "Search skincare products...";
search.setAttribute("aria-label", "Search products");
search.style.cssText =
  "width:100%;max-width:300px;padding:11px;border:1px solid #e9eaf1;border-radius:8px;margin-bottom:18px";

document.querySelector(".catalog-heading").after(search);
search.addEventListener("input", renderProducts);

renderProducts();
updateCart();
