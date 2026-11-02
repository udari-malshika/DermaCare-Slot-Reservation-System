import { auth, db } from "./firebase.js";
import {
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const CART_KEY = "dermacare-cart-v1";
const money = (amount) => `LKR ${Number(amount).toLocaleString("en-LK")}`;
const form = document.getElementById("checkoutForm");
const itemsEl = document.getElementById("orderItems");
const totalEl = document.getElementById("orderTotal");
const messageEl = document.getElementById("checkoutMessage");
let authReady = false;

onAuthStateChanged(auth, (user) => {
  authReady = true;
  if (user) {
    form.elements.name.value ||= user.displayName || "";
    form.elements.email.value ||= user.email || "";
  }
});

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

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const cart = getCart();
  if (!form.reportValidity() || !cart.length) {
    messageEl.textContent = "Please add products and complete your details.";
    messageEl.className = "checkout-message error";
    return;
  }

  if (!authReady) {
    messageEl.textContent = "Checking your sign-in. Please try again in a moment.";
    messageEl.className = "checkout-message error";
    return;
  }

  const user = auth.currentUser;
  if (!user) {
    messageEl.innerHTML = 'Please <a href="login.html?next=checkout.html">log in</a> before placing your order.';
    messageEl.className = "checkout-message error";
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  const orderId = `DC-${Date.now().toString().slice(-8)}`;
  const formData = new FormData(form);
  const total = cart.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
  const order = {
    id: orderId,
    ownerUid: user.uid,
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
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(collection(db, "orders"), order);
    localStorage.removeItem(CART_KEY);
    form.reset();
    messageEl.textContent = `Order ${orderId} prepared successfully. Our team will contact you shortly.`;
    messageEl.className = "checkout-message success";
    renderOrder();
  } catch (error) {
    console.error("Unable to save order to Firebase.", error);
    messageEl.textContent = "Unable to save your order. Please try again.";
    messageEl.className = "checkout-message error";
  } finally {
    submitButton.disabled = getCart().length === 0;
  }
});

renderOrder();
