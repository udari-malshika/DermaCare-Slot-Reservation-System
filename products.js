// DermaCare product listing and shopping cart
// Demo products: change these details to your actual products.

const products = [
  {
    id: 1,
    name: "Rose Glow Face Serum",
    category: "Serum",
    skin: "Dry",
    price: 3000,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=700&q=80",
    description: "A lightweight facial serum for a smooth, hydrated-looking glow."
  },
  {
    id: 2,
    name: "Gentle Daily Cleanser",
    category: "Cleanser",
    skin: "Sensitive",
    price: 2500,
    image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=700&q=80",
    description: "A gentle daily cleanser to help remove dirt and excess oil."
  },
  {
    id: 3,
    name: "Hydra Soft Moisturizer",
    category: "Moisturizer",
    skin: "Dry",
    price: 3500,
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=700&q=80",
    description: "A nourishing moisturizer for soft, comfortable-feeling skin."
  },
  {
    id: 4,
    name: "Daily Sun Shield",
    category: "Sunscreen",
    skin: "Normal",
    price: 4000,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=700&q=80",
    description: "A sunscreen option for your daytime skincare routine."
  },
  {
    id: 5,
    name: "Purifying Face Mask",
    category: "Mask",
    skin: "Oily",
    price: 2200,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=700&q=80",
    description: "A face mask to complement your weekly skincare routine."
  },
  {
    id: 6,
    name: "Daily Balance Serum",
    category: "Serum",
    skin: "Combination",
    price: 3200,
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=700&q=80",
    description: "A lightweight serum for a simple daily skincare routine."
  }
];

const $ = id => document.getElementById(id);

const grid = $("productsGrid");
const cartCount = $("cartCount");
const cartButton = $("cartButton");
const category = $("category");
const skin = $("skin");
const priceRange = $("priceRange");
const priceValue = $("priceValue");
const search = $("search");
const sort = $("sort");
const resultCount = $("resultCount");
const emptyState = $("emptyState");

const CART_KEY = "dermacare-cart-v1";

let cart = readCart();

// Load cart from localStorage
function readCart() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(CART_KEY) || "[]"
    );

    return Array.isArray(saved)
      ? saved
          .filter(item =>
            products.some(
              product => product.id === Number(item.id)
            ) &&
            Number(item.quantity) > 0
          )
          .map(item => ({
            ...products.find(
              product => product.id === Number(item.id)
            ),
            quantity: Math.floor(Number(item.quantity))
          }))
      : [];
  } catch {
    return [];
  }
}

// Format prices in Sri Lankan rupees
const money = amount =>
  "LKR " + Number(amount).toLocaleString("en-LK");

// Save cart and refresh cart count
function saveCart() {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );

  updateCartCount();
}

// Update number displayed on Cart button
function updateCartCount() {
  cartCount.textContent = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
}

// Display products
function renderProducts() {
  let list = products.filter(product => {
    const q = search.value.trim().toLowerCase();

    return (
      (category.value === "all" ||
        product.category === category.value) &&

      (skin.value === "all" ||
        product.skin === skin.value) &&

      product.price <= Number(priceRange.value) &&

      (
        product.name.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.skin.toLowerCase().includes(q)
      )
    );
  });

  // Sorting
  if (sort.value === "low") {
    list.sort((a, b) => a.price - b.price);
  }

  if (sort.value === "high") {
    list.sort((a, b) => b.price - a.price);
  }

  if (sort.value === "name") {
    list.sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  resultCount.textContent =
    `Showing ${list.length} product${list.length === 1 ? "" : "s"}`;

  emptyState.hidden = list.length !== 0;

  grid.innerHTML = list.map(product => `
    <article class="product-card">

      <button
        class="product-image-button"
        type="button"
        data-action="details"
        data-id="${product.id}"
        aria-label="View ${product.name} details"
      >
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >
      </button>

      <div class="product-info">

        <span class="product-category">
          ${product.category}
        </span>

        <h3>${product.name}</h3>

        <p class="product-skin">
          ${product.skin} skin
        </p>

        <div class="product-price">
          ${money(product.price)}
        </div>

        <button
          class="details-btn"
          type="button"
          data-action="details"
          data-id="${product.id}"
        >
          View Details
        </button>

        <button
          class="add-cart-btn"
          type="button"
          data-action="add"
          data-id="${product.id}"
        >
          ＋ Add to Cart
        </button>

      </div>
    </article>
  `).join("");
}

// Show notification
let toastTimer;

function showMessage(message) {
  const toast = $("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

// Add product to cart
function addToCart(id) {
  const product = products.find(
    item => item.id === Number(id)
  );

  if (!product) return;

  const existing = cart.find(
    item => item.id === product.id
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  saveCart();

  showMessage(
    `${product.name} added to cart 💜`
  );
}

// Create modal window
function ensureModal() {
  if ($("storeModal")) return;

  document.body.insertAdjacentHTML(
    "beforeend",
    `
      <div
        class="store-modal"
        id="storeModal"
        aria-hidden="true"
      >
        <section
          class="store-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
        >
          <button
            class="modal-close"
            type="button"
            data-action="close"
            aria-label="Close"
          >×</button>

          <div id="modalContent"></div>
        </section>
      </div>
    `
  );
}

// Open modal with selected content
function openModal(content) {
  ensureModal();

  $("modalContent").innerHTML = content;

  $("storeModal").classList.add("open");

  $("storeModal").setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.classList.add("modal-open");
}

// Close modal
function closeModal() {
  const modal = $("storeModal");

  if (!modal) return;

  modal.classList.remove("open");

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.classList.remove("modal-open");
}

// Show product details
function showDetails(id) {
  const product = products.find(
    item => item.id === Number(id)
  );

  if (!product) return;

  openModal(`
    <div class="detail-layout">

      <img
        class="detail-image"
        src="${product.image}"
        alt="${product.name}"
      >

      <div class="detail-info">

        <span class="product-category">
          ${product.category}
        </span>

        <h2 id="modalTitle">
          ${product.name}
        </h2>

        <p>${product.description}</p>

        <p>
          <strong>Skin type:</strong>
          ${product.skin}
        </p>

        <div class="product-price">
          ${money(product.price)}
        </div>

        <button
          class="add-cart-btn"
          type="button"
          data-action="add"
          data-id="${product.id}"
        >
          ＋ Add to Cart
        </button>

      </div>
    </div>
  `);
}

// Display shopping cart
function showCart() {
  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const itemsHTML = cart.length
    ? cart.map(item => `
        <div class="cart-item">

          <img
            src="${item.image}"
            alt="${item.name}"
          >

          <div class="cart-item-info">

            <strong>${item.name}</strong>

            <span>
              ${money(item.price)} each
            </span>

            <div class="quantity-controls">

              <button
                type="button"
                data-action="decrease"
                data-id="${item.id}"
                aria-label="Decrease quantity"
              >−</button>

              <span>${item.quantity}</span>

              <button
                type="button"
                data-action="increase"
                data-id="${item.id}"
                aria-label="Increase quantity"
              >＋</button>

            </div>
          </div>

          <button
            class="remove-item"
            type="button"
            data-action="remove"
            data-id="${item.id}"
          >
            Remove
          </button>

        </div>
      `).join("")
    : `
        <div class="cart-empty">
          <p>Your cart is empty 🛍️</p>
          <p>Add a product to get started.</p>
        </div>
      `;

  openModal(`
    <h2 id="modalTitle">
      Your Shopping Cart 🛒
    </h2>

    <div class="cart-items">
      ${itemsHTML}
    </div>

    <div class="cart-total">
      <span>Subtotal</span>
      <strong>${money(total)}</strong>
    </div>

    <p class="cart-note">
      Delivery charges, if applicable, are not included.
    </p>

    ${
      cart.length
        ? `
          <button
            class="checkout-btn"
            type="button"
            data-action="checkout"
          >
            Continue to Order
          </button>
        `
        : ""
    }
  `);
}

// Increase or decrease item quantity
function updateQuantity(id, amount) {
  const item = cart.find(
    product => product.id === Number(id)
  );

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(
      product => product.id !== Number(id)
    );
  }

  saveCart();
  showCart();
}

// Remove product from cart
function removeItem(id) {
  cart = cart.filter(
    item => item.id !== Number(id)
  );

  saveCart();
  showCart();
}

// Prepare checkout form
function showCheckout() {
  if (!cart.length) {
    return showCart();
  }

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  openModal(`
    <h2 id="modalTitle">
      Order Details
    </h2>

    <p class="cart-note">
      Enter your details to prepare your order.
      This demo does not process online payments.
    </p>

    <form class="checkout-form" id="checkoutForm">

      <label>
        Full name
        <input
          name="name"
          required
          autocomplete="name"
        >
      </label>

      <label>
        Phone number
        <input
          name="phone"
          required
          type="tel"
          autocomplete="tel"
        >
      </label>

      <label>
        Delivery address
        <textarea
          name="address"
          required
          rows="3"
          autocomplete="street-address"
        ></textarea>
      </label>

      <div class="cart-total">
        <span>Order subtotal</span>
        <strong>${money(total)}</strong>
      </div>

      <button
        class="checkout-btn"
        type="submit"
      >
        Prepare Order
      </button>

    </form>
  `);
}

// Handle buttons throughout the page
document.addEventListener("click", event => {
  const actionButton = event.target.closest(
    "[data-action]"
  );

  if (actionButton) {
    const action = actionButton.dataset.action;
    const id = actionButton.dataset.id;

    if (action === "details") showDetails(id);
    if (action === "add") addToCart(id);
    if (action === "close") closeModal();
    if (action === "increase") updateQuantity(id, 1);
    if (action === "decrease") updateQuantity(id, -1);
    if (action === "remove") removeItem(id);
    if (action === "checkout") showCheckout();
  }

  if (event.target.id === "storeModal") {
    closeModal();
  }
});

// Prevent the checkout form from refreshing the page
document.addEventListener("submit", event => {
  if (event.target.id !== "checkoutForm") return;

  event.preventDefault();

  const formData = new FormData(event.target);

  const name = String(
    formData.get("name")
  ).trim();

  const phone = String(
    formData.get("phone")
  ).trim();

  const address = String(
    formData.get("address")
  ).trim();

  if (!name || !phone || !address) return;

  const orderLines = cart.map(item =>
    `${item.name} x ${item.quantity} — ${money(item.price * item.quantity)}`
  ).join("\n");

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  openModal(`
    <h2 id="modalTitle">
      Order Prepared 💜
    </h2>

    <p>
      Thank you, ${escapeHTML(name)}.
      Your order summary is ready.
    </p>

    <pre style="
      white-space:pre-wrap;
      overflow-wrap:anywhere;
      background:#fff4f8;
      padding:14px;
      border-radius:12px;
      font:13px/1.7 'DM Sans',sans-serif
    ">${escapeHTML(orderLines)}

Subtotal: ${money(total)}
Phone: ${escapeHTML(phone)}
Address: ${escapeHTML(address)}</pre>

    <p class="cart-note">
      This website currently prepares an order summary only.
      Connect a backend or order service to actually submit
      and save orders.
    </p>

    <button
      class="checkout-btn"
      type="button"
      data-action="finish-order"
    >
      Finish
    </button>
  `);
});

// Escape text before displaying user-entered details
function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]
  );
}

// Finish demo order
document.addEventListener("click", event => {
  if (
    event.target.closest(
      '[data-action="finish-order"]'
    )
  ) {
    cart = [];

    saveCart();
    closeModal();

    showMessage(
      "Order summary completed. Cart cleared."
    );
  }
});

// Cart button
cartButton.addEventListener("click", showCart);

// Search, filters and sorting
[category, skin, priceRange, search, sort].forEach(
  control => {
    control.addEventListener("input", renderProducts);
    control.addEventListener("change", renderProducts);
  }
);

// Reset all filters
function resetFilters() {
  category.value = "all";
  skin.value = "all";
  priceRange.value = "10000";
  search.value = "";
  sort.value = "featured";

  priceValue.textContent = "Up to LKR 10,000";

  renderProducts();
}

priceRange.addEventListener("input", () => {
  priceValue.textContent =
    `Up to ${money(Number(priceRange.value))}`;
});

$("reset").addEventListener("click", resetFilters);

$("resetEmpty").addEventListener(
  "click",
  resetFilters
);

// Close modal with Escape key
document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeModal();
  }
});

// Initial page setup
updateCartCount();
renderProducts();