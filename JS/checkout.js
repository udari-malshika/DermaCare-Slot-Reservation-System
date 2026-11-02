const CART_KEY = "dermacare-cart-v1";
const ORDERS_KEY = "dermacare-orders";
const money = (amount) => `LKR ${Number(amount).toLocaleString("en-LK")}`;
const form = document.getElementById("checkoutForm");
const itemsEl = document.getElementById("orderItems");
const totalEl = document.getElementById("orderTotal");
const messageEl = document.getElementById("checkoutMessage");

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(cart) ? cart.filter((item) => Number(item.quantity) > 0) : [];
  } catch (error) {
    console.error("Unable to read checkout cart.", error);
    return [];
  }
}

function renderOrder() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  itemsEl.innerHTML = cart.length
    ? cart.map((item) => `<div class="order-line"><span>${escapeHTML(item.name)} × ${item.quantity}</span><strong>${money(item.price * item.quantity)}</strong></div>`).join("")
    : "<p class=\"checkout-message\">Your cart is empty. <a href=\"products.html\">Shop products</a>.</p>";
  totalEl.textContent = money(total);
  form.querySelector("button[type=submit]").disabled = cart.length === 0;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
}

function saveOrder(order) {
  try {
    const saved = JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
    const orders = Array.isArray(saved) ? saved : [];
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    return true;
  } catch (error) {
    console.error("Unable to save order for the admin dashboard.", error);
    return false;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const cart = getCart();
  if (!form.reportValidity() || !cart.length) {
    messageEl.textContent = "Please add products and complete your details.";
    messageEl.className = "checkout-message error";
    return;
  }
  const orderId = `DC-${Date.now().toString().slice(-8)}`;
  const formData = new FormData(form);
  const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const order = {
    id: orderId,
    customerName: String(formData.get("name")).trim(),
    email: String(formData.get("email")).trim().toLowerCase(),
    phone: String(formData.get("phone")).trim(),
    address: String(formData.get("address")).trim(),
    paymentMethod: String(formData.get("payment")),
    items: cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    total,
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  if (!saveOrder(order)) {
    messageEl.textContent = "Unable to save your order. Please try again.";
    messageEl.className = "checkout-message error";
    return;
  }

  localStorage.removeItem(CART_KEY);
  form.reset();
  messageEl.textContent = `Order ${orderId} prepared successfully. Our team will contact you shortly.`;
  messageEl.className = "checkout-message success";
  renderOrder();
});

renderOrder();
