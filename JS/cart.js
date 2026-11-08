const CART_KEY = "dermacare-cart-v1";
const money = (amount) => `LKR ${Number(amount).toLocaleString("en-LK")}`;
const getCart = () => {
  try {
    const items = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(items) ? items.filter((item) => Number(item.quantity) > 0) : [];
  } catch (error) {
    console.error("Unable to read cart.", error);
    return [];
  }
};

let cart = getCart();
const itemsEl = document.getElementById("cartItems");
const emptyEl = document.getElementById("emptyCart");
const countEl = document.getElementById("cartItemCount");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");
const checkoutButton = document.getElementById("checkoutButton");

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function renderCart() {
  const count = cart.reduce((total, item) => total + Number(item.quantity), 0);
  const subtotal = cart.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);
  countEl.textContent = `${count} item${count === 1 ? "" : "s"}`;
  subtotalEl.textContent = money(subtotal);
  totalEl.textContent = money(subtotal);
  emptyEl.hidden = cart.length > 0;
  checkoutButton.disabled = cart.length === 0;
  itemsEl.innerHTML = cart.map((item) => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}" onerror="this.src='../Images/centella%20cream.jpg'">
      <div>
        <h3>${escapeHTML(item.name)}</h3>
        <small>${escapeHTML(item.category)} · ${escapeHTML(item.skin)} skin</small>
        <div class="quantity">
          <button type="button" data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <strong>${item.quantity}</strong>
          <button type="button" data-action="increase" data-id="${item.id}" aria-label="Increase quantity">＋</button>
          <span class="item-price">${money(item.price * item.quantity)}</span>
        </div>
      </div>
      <button class="remove-button" type="button" data-action="remove" data-id="${item.id}">Remove</button>
    </article>
  `).join("");
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const item = cart.find((entry) => entry.id === Number(button.dataset.id));
  if (!item) return;
  if (button.dataset.action === "increase") item.quantity += 1;
  if (button.dataset.action === "decrease") item.quantity -= 1;
  if (button.dataset.action === "remove" || item.quantity <= 0) {
    cart = cart.filter((entry) => entry.id !== item.id);
  }
  saveCart();
  renderCart();
});

checkoutButton.addEventListener("click", () => {
  if (cart.length) window.location.href = "checkout.html";
});
window.addEventListener("storage", (event) => {
  if (event.key === CART_KEY) {
    cart = getCart();
    renderCart();
  }
});
renderCart();
