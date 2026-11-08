// DermaCare product listing and shopping cart
// Demo products: change these details to your actual products.

const FALLBACK_PRODUCT_IMAGE = "../Images/centella%20cream.jpg";

const productCatalog = [
  {
    id: 1,
    name: "Anua 10+ Azelaic Serum",
    category: "Serum",
    skin: "Sensitive",
    price: 5500,
    image: "../Images/Anua%20Green.jpg",
    description: "A gentle radiance-boosting serum designed for a calm, even-looking finish."
  },
  {
    id: 2,
    name: "Medicube Deep Vita C Cream",
    category: "Moisturizer",
    skin: "Normal",
    price: 6800,
    image: "../Images/Medicube%20Deep%20Vita%20C%20cap%20cream.jpg",
    description: "A brightening cream with vitamin-rich care for a healthy glow."
  },
  {
    id: 3,
    name: "COSRX Advanced Snail 92 Cream",
    category: "Moisturizer",
    skin: "Dry",
    price: 6200,
    image: "../Images/Snail%2092%20Cream.jpg",
    description: "A deeply nourishing cream for hydration and skin comfort."
  },
  {
    id: 4,
    name: "The Ordinary AHA 30% BHA 2%",
    category: "Serum",
    skin: "Oily",
    price: 5200,
    image: "../Images/Ord%20AHA.jpg",
    description: "A targeted exfoliating treatment for a smoother skin texture."
  },
  {
    id: 5,
    name: "Mediheal Green Essence Mask",
    category: "Mask",
    skin: "Sensitive",
    price: 3800,
    image: "../Images/mediheal%20green.jpg",
    description: "A calming sheet mask to refresh and soothe tired-looking skin."
  },
  {
    id: 6,
    name: "Medicube Pink Eye Cream",
    category: "Moisturizer",
    skin: "Dry",
    price: 4300,
    image: "../Images/Medicube%20Pink%20eye%20Cream.jpg",
    description: "A lightweight eye cream that helps hydrate and soften the eye area."
  },
  {
    id: 7,
    name: "Centella Green Serum",
    category: "Serum",
    skin: "Sensitive",
    price: 4800,
    image: "../Images/Centella%20green%20serum.jpg",
    description: "A soothing serum that supports a balanced and calm complexion."
  },
  {
    id: 8,
    name: "Snail Mucin Gel Cleanser",
    category: "Cleanser",
    skin: "Sensitive",
    price: 4600,
    image: "../Images/Snail%20cleanser.jpg",
    description: "A gentle cleanser that refreshes skin without stripping moisture."
  },
  {
    id: 9,
    name: "Arencia Vitamin C Serum",
    category: "Serum",
    skin: "Normal",
    price: 6900,
    image: "../Images/Arencia%20vitemin%20C.jpg",
    description: "A glow-boosting vitamin C treatment designed for daily radiance."
  }
];

productCatalog.push(
  {
    id: 10,
    name: "345 Skin Barrier Cream",
    category: "Moisturizer",
    skin: "Sensitive",
    price: 5900,
    image: "../Images/345%20cream.jpg",
    description: "A comforting barrier cream for soft, hydrated-looking skin."
  },
  {
    id: 11,
    name: "Anua Heartleaf Cleansing Pad",
    category: "Cleanser",
    skin: "Sensitive",
    price: 4200,
    image: "../Images/Anua%20Clean%20pad.jpg",
    description: "Refreshing cleansing pads for a gentle daily skin reset."
  },
  {
    id: 12,
    name: "Anua Niacinamide Serum",
    category: "Serum",
    skin: "Oily",
    price: 5700,
    image: "../Images/Anua%20Niasinamide.jpg",
    description: "A balancing serum for a smoother, brighter-looking complexion."
  },
  {
    id: 13,
    name: "Anua PDRN Hyaluronic Serum",
    category: "Serum",
    skin: "Dry",
    price: 7200,
    image: "../Images/Anua%20PDRN%20Hyaluro.jpg",
    description: "A deeply hydrating formula for a plump, dewy-looking finish."
  },
  {
    id: 14,
    name: "Beauty of Joseon Plum Cleanser",
    category: "Cleanser",
    skin: "Normal",
    price: 4900,
    image: "../Images/Beauty%20of%20Jonsen%20Pulm.jpg",
    description: "A mild gel cleanser that leaves skin fresh and comfortable."
  },
  {
    id: 15,
    name: "Beauty of Joseon Plum Toner",
    category: "Serum",
    skin: "Dry",
    price: 5100,
    image: "../Images/Beauty%20of%20jonsen%20Pulm%20toner.jpg",
    description: "A softening toner to help prepare skin for the rest of your routine."
  },
  {
    id: 16,
    name: "Biodance Soothing Mask",
    category: "Mask",
    skin: "Sensitive",
    price: 3600,
    image: "../Images/Biodance%20mask.jpg",
    description: "A soothing mask for a refreshed, replenished-looking complexion."
  },
  {
    id: 17,
    name: "CO2 Laser Treatment",
    category: "Treatment",
    skin: "Normal",
    price: 35000,
    image: "../Images/CO2%20Laser%20treatment.jpg",
    description: "A professional resurfacing treatment available at DermoCare."
  },
  {
    id: 18,
    name: "CO2 Laser Care",
    category: "Treatment",
    skin: "Normal",
    price: 35000,
    image: "../Images/CO2%20laser.jpg",
    description: "Explore DermoCare's advanced CO2 laser care option."
  },
  {
    id: 19,
    name: "Carbon Laser Peel",
    category: "Treatment",
    skin: "Oily",
    price: 28000,
    image: "../Images/Carbon%20laser%20peel.jpg",
    description: "A professional glow-focused treatment for smoother-looking skin."
  },
  {
    id: 20,
    name: "Centella White Serum",
    category: "Serum",
    skin: "Sensitive",
    price: 5300,
    image: "../Images/Centella%20White%20serum.jpg",
    description: "A calming brightening serum for an even-looking complexion."
  },
  {
    id: 21,
    name: "Centella Brown Serum",
    category: "Serum",
    skin: "Normal",
    price: 5000,
    image: "../Images/Centella%20brown%20serum.jpg",
    description: "A nourishing daily serum for balanced-looking skin."
  },
  {
    id: 22,
    name: "Centella Gentle Cleanser",
    category: "Cleanser",
    skin: "Sensitive",
    price: 4500,
    image: "../Images/Centella%20cleanser.jpg",
    description: "A gentle cleanser made for a calm and comfortable cleanse."
  },
  {
    id: 23,
    name: "Centella Eye Cream",
    category: "Moisturizer",
    skin: "Dry",
    price: 4400,
    image: "../Images/Centella%20eye%20cream.jpg",
    description: "Lightweight hydration for the delicate eye area."
  },
  {
    id: 24,
    name: "Centella Pink Mask",
    category: "Mask",
    skin: "Sensitive",
    price: 3500,
    image: "../Images/Centella%20pink%20mask.jpg",
    description: "A calming mask for a soft, refreshed-looking glow."
  },
  {
    id: 25,
    name: "Dark Spot Correcting Serum",
    category: "Serum",
    skin: "Normal",
    price: 6100,
    image: "../Images/Dark%20spot%20correcting%20glow%20serum.jpg",
    description: "A targeted serum for a visibly brighter-looking routine."
  },
  {
    id: 26,
    name: "Medicube Hyaluronic Cream",
    category: "Moisturizer",
    skin: "Dry",
    price: 6700,
    image: "../Images/Medicube%20Hyaluronic%20cap%20cream.jpg",
    description: "A cushiony hyaluronic cream for lasting-looking hydration."
  },
  {
    id: 27,
    name: "Medicube Neck Wrinkle Cream",
    category: "Moisturizer",
    skin: "Dry",
    price: 6500,
    image: "../Images/Medicube%20Neck%20Wrinkle%20Cream.jpg",
    description: "Nourishing care designed for the neck and décolletage."
  },
  {
    id: 28,
    name: "Medicube Niacinamide Cream",
    category: "Moisturizer",
    skin: "Oily",
    price: 6300,
    image: "../Images/Medicube%20Niacinamide%20cap%20cream.jpg",
    description: "A lightweight cream for balanced, healthy-looking skin."
  },
  {
    id: 29,
    name: "Medicube Pink Capsule Cream",
    category: "Moisturizer",
    skin: "Normal",
    price: 6800,
    image: "../Images/Medicube%20Pink%20cap%20cream.jpg",
    description: "A plush daily moisturizer for a radiant-looking finish."
  },
  {
    id: 30,
    name: "Medicube Pink Mask",
    category: "Mask",
    skin: "Dry",
    price: 3900,
    image: "../Images/Medicube%20Pink%20mask.jpg",
    description: "A moisture-loving mask for a soft and luminous-looking complexion."
  },
  {
    id: 31,
    name: "Medicube Pink Serum",
    category: "Serum",
    skin: "Normal",
    price: 6200,
    image: "../Images/Medicube%20Pink%20serum.jpg",
    description: "A glow-supporting serum for a smooth-looking daily ritual."
  },
  {
    id: 32,
    name: "Medicube Facial Mask",
    category: "Mask",
    skin: "Normal",
    price: 3700,
    image: "../Images/Medicube%20mask.jpg",
    description: "A replenishing mask to elevate your weekly skincare ritual."
  },
  {
    id: 33,
    name: "The Ordinary Gentle Cleanser",
    category: "Cleanser",
    skin: "Normal",
    price: 4000,
    image: "../Images/Ord%20Clens.jpg",
    description: "A simple, gentle cleanser for a clean and comfortable finish."
  },
  {
    id: 34,
    name: "The Ordinary Lactic Acid",
    category: "Serum",
    skin: "Sensitive",
    price: 4700,
    image: "../Images/Ord%20Lactic%20acid.jpg",
    description: "A gentle exfoliating formula for smoother-looking skin texture."
  },
  {
    id: 35,
    name: "The Ordinary Moisturizer",
    category: "Moisturizer",
    skin: "Dry",
    price: 4300,
    image: "../Images/Ord%20Moisture.jpg",
    description: "An everyday moisturizer for soft and comfortable-looking skin."
  },
  {
    id: 36,
    name: "The Ordinary Niacinamide",
    category: "Serum",
    skin: "Oily",
    price: 4500,
    image: "../Images/Ord%20Niacinamide.jpg",
    description: "A balancing serum for a refined and even-looking appearance."
  },
  {
    id: 37,
    name: "The Ordinary Retinol",
    category: "Serum",
    skin: "Normal",
    price: 4900,
    image: "../Images/Ord%20Ratinol.jpg",
    description: "A nighttime-focused formula for a smoother-looking skin routine."
  },
  {
    id: 38,
    name: "The Ordinary Glycolic Care",
    category: "Serum",
    skin: "Oily",
    price: 4600,
    image: "../Images/ord%20Glyc.jpg",
    description: "A glow-renewing exfoliating care option for a fresh-looking finish."
  },
  {
    id: 39,
    name: "PRP Skin Therapy",
    category: "Treatment",
    skin: "Normal",
    price: 30000,
    image: "../Images/PRP%20therepy.jpg",
    description: "A professional skin rejuvenation treatment available at DermoCare."
  },
  {
    id: 40,
    name: "Pigmentation Laser Care",
    category: "Treatment",
    skin: "Normal",
    price: 26000,
    image: "../Images/Pigmentation%20Remove.png",
    description: "Professional pigmentation-focused care for a more even-looking tone."
  },
  {
    id: 41,
    name: "Pigmentation Renewal Treatment",
    category: "Treatment",
    skin: "Normal",
    price: 26000,
    image: "../Images/Pigmentation%20Removel.jpg",
    description: "A clinic treatment designed to support a brighter-looking complexion."
  },
  {
    id: 42,
    name: "Pigmentation Care",
    category: "Treatment",
    skin: "Sensitive",
    price: 26000,
    image: "../Images/Pigmentation%20Removel.png",
    description: "A professional pigmentation care option tailored to your skin goals."
  },
  {
    id: 43,
    name: "Purito Green Barrier Cream",
    category: "Moisturizer",
    skin: "Sensitive",
    price: 5400,
    image: "../Images/Purito%20green%20Cream.jpg",
    description: "A soothing cream for calm, nourished-looking skin."
  },
  {
    id: 44,
    name: "RF Microneedling",
    category: "Treatment",
    skin: "Normal",
    price: 32000,
    image: "../Images/RF%20microneedling.jpg",
    description: "A professional skin-firming treatment available at the clinic."
  },
  {
    id: 45,
    name: "Some By Mi Skincare",
    category: "Serum",
    skin: "Oily",
    price: 5200,
    image: "../Images/SOME%20BY%20MI.jpg",
    description: "A refreshing formula for a clearer, more balanced-looking routine."
  },
  {
    id: 46,
    name: "Snail 9 Repair Serum",
    category: "Serum",
    skin: "Dry",
    price: 5600,
    image: "../Images/Snail%209%20serum.jpg",
    description: "A comforting repair serum for hydrated-looking skin."
  },
  {
    id: 47,
    name: "Botox & Filler Consultation",
    category: "Treatment",
    skin: "Normal",
    price: 25000,
    image: "../Images/botox%20%26%20filler.jpg",
    description: "Book a professional consultation for personalized aesthetic care."
  },
  {
    id: 48,
    name: "Centella Blue Serum",
    category: "Serum",
    skin: "Sensitive",
    price: 5100,
    image: "../Images/centella%20blue%20serum.jpg",
    description: "A cooling, calming serum for a balanced-looking complexion."
  },
  {
    id: 49,
    name: "Centella Comfort Cream",
    category: "Moisturizer",
    skin: "Sensitive",
    price: 5300,
    image: "../Images/centella%20cream.jpg",
    description: "A gentle cream for a soft, comforted-looking skin finish."
  },
  {
    id: 50,
    name: "Chemical Peeling",
    category: "Treatment",
    skin: "Oily",
    price: 18000,
    image: "../Images/chemical%20peeling.jpg",
    description: "A professional exfoliating treatment for smoother-looking skin."
  },
  {
    id: 51,
    name: "Snail Mucin Cleanser",
    category: "Cleanser",
    skin: "Sensitive",
    price: 4600,
    image: "../Images/Snail%20cleanser.jpg",
    description: "A gentle snail mucin cleanser for a soft, refreshed-looking finish."
  }
);

const products = productCatalog;

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
          onerror="this.onerror=null;this.src='../Images/centella%20cream.jpg';"
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
const addFeedbackTimers = new WeakMap();

function showMessage(message) {
  const toast = $("toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function showAddFeedback(button) {
  button.classList.add("is-added");
  clearTimeout(addFeedbackTimers.get(button));

  const timer = setTimeout(() => {
    button.classList.remove("is-added");
    addFeedbackTimers.delete(button);
  }, 1600);

  addFeedbackTimers.set(button, timer);
}

// Add product to cart
function addToCart(id, button) {
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
  showAddFeedback(button);

  showMessage(
    `${product.name} added to cart.`
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
        onerror="this.onerror=null;this.src='../Images/centella%20cream.jpg';"
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
            Go to checkout
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

  window.location.href = "checkout.html";
  return;

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
    if (action === "add") addToCart(id, actionButton);
    if (action === "close") closeModal();
    if (action === "increase") updateQuantity(id, 1);
    if (action === "decrease") updateQuantity(id, -1);
    if (action === "remove") removeItem(id);
    if (action === "checkout") showCheckout();
  }

  const productImageButton = event.target.closest(".product-image-button");
  if (productImageButton) {
    const productId = Number(productImageButton.dataset.id);
    const product = products.find(item => item.id === productId);
    if (product) {
      openLightbox(products.findIndex(item => item.id === product.id));
    }
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
cartButton.addEventListener("click", () => {
  window.location.href = "cart.html";
});

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

// Lightbox for product images
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCaption = document.getElementById("lbCaption");
const lbClose = document.getElementById("lbClose");
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");

let lightboxIndex = 0;
let lightboxItems = [];

function openLightbox(index) {
  if (!lightboxItems.length) return;

  lightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
  const item = lightboxItems[lightboxIndex];

  lbImg.onerror = () => {
    lbImg.src = "../Images/centella%20cream.jpg";
  };
  lbImg.src = item.image;
  lbCaption.textContent = item.name;
  lightbox.classList.add("open");
  document.body.classList.add("modal-open");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.classList.remove("modal-open");
}

function moveLightbox(step) {
  if (!lightboxItems.length) return;
  openLightbox(lightboxIndex + step);
}

function updateLightboxItems() {
  lightboxItems = products.map(product => ({
    name: product.name,
    image: product.image
  }));
}

lbClose.addEventListener("click", closeLightbox);
lbPrev.addEventListener("click", () => moveLightbox(-1));
lbNext.addEventListener("click", () => moveLightbox(1));

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

window.addEventListener("keydown", event => {
  if (!lightbox.classList.contains("open")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") moveLightbox(-1);
  if (event.key === "ArrowRight") moveLightbox(1);
});

updateLightboxItems();

function setProductImageFallback(imgElement, imageUrl) {
  imgElement.onerror = () => {
    if (imgElement.src !== location.origin + "/" + FALLBACK_PRODUCT_IMAGE) {
      imgElement.src = FALLBACK_PRODUCT_IMAGE;
    }
  };

  imgElement.src = imageUrl;
}