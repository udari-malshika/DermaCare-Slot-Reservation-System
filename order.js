import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { doc, getDoc, serverTimestamp, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";

const CART_KEY = "dermacare-cart";
const CART_OWNER_KEY = "dermacare-cart-owner";
const PRODUCT_CATALOG = {
  1: { name: "Gentle Foaming Cleanser", price: 4200 },
  2: { name: "Vitamin C Brightening Serum", price: 5850 },
  3: { name: "Hydrating Barrier Cream", price: 6400 },
  4: { name: "Mineral SPF 50 Shield", price: 3800 },
  5: { name: "Advanced Retinol Serum", price: 3980 },
  6: { name: "Daily Hydrating Cleanser", price: 3200 },
  7: { name: "Oil Control Moisturizer", price: 4500 },
  8: { name: "Daily Glow Sunscreen", price: 3500 },
  9: { name: "Soothing Skin Serum", price: 5200 },
  10: { name: "Centella Recovery Cream", price: 6100 },
  11: { name: "Green Glow Essence", price: 5750 },
  12: { name: "Pore Refining Serum", price: 4900 },
  13: { name: "Barrier Repair Mask", price: 4700 },
  14: { name: "Niacinamide Daily Essence", price: 5600 }
};
const form = document.getElementById("paymentForm");
const message = document.getElementById("formMessage");
const itemsContainer = document.getElementById("summaryItems");
const subtotalElement = document.getElementById("subtotal");
const deliveryElement = document.getElementById("delivery");
const totalElement = document.getElementById("total");
const submitButton = form.querySelector('button[type="submit"]');
const createOrder = httpsCallable(getFunctions(auth.app, "us-central1"), "createOrder");
let currentUser = null;
let cartItems = [];

function localCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    console.error("Unable to read the browser cart:", error);
    throw new Error("Unable to read your cart. Return to the product page and try again.");
  }
}

function showMessage(text, type = "") {
  message.textContent = text;
  message.className = type ? `message ${type}` : "message";
}

function renderSummary(items) {
  itemsContainer.replaceChildren();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = items.length ? 500 : 0;
  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "summary-item";
    const description = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = item.name;
    const quantity = document.createElement("small");
    quantity.textContent = `Qty: ${item.quantity}`;
    description.append(name, quantity);
    const price = document.createElement("strong");
    price.textContent = `LKR ${(item.price * item.quantity).toLocaleString("en-LK")}`;
    row.append(description, price);
    itemsContainer.appendChild(row);
  });

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "empty-box";
    empty.textContent = "Your cart is empty. Add products before placing an order.";
    itemsContainer.appendChild(empty);
  }
  subtotalElement.textContent = `LKR ${subtotal.toLocaleString("en-LK")}`;
  deliveryElement.textContent = `LKR ${delivery.toLocaleString("en-LK")}`;
  totalElement.textContent = `LKR ${(subtotal + delivery).toLocaleString("en-LK")}`;
  submitButton.disabled = !items.length;
}

async function loadCart(user) {
  const savedOwner = localStorage.getItem(CART_OWNER_KEY);
  if (savedOwner && savedOwner !== user.uid) {
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(CART_OWNER_KEY);
  }

  const cartRef = doc(db, "carts", user.uid);
  const snapshot = await getDoc(cartRef);
  if (snapshot.exists()) {
    const savedItems = snapshot.data().items;
    cartItems = Array.isArray(savedItems) ? savedItems : [];
  } else {
    const savedItems = localCart().map((item) => ({ id: item.id, quantity: item.quantity }));
    cartItems = savedItems;
    if (savedItems.length) {
      await setDoc(cartRef, { items: savedItems, updatedAt: serverTimestamp() });
      localStorage.setItem(CART_OWNER_KEY, user.uid);
    }
  }

  const localProducts = new Map(localCart().map((item) => [Number(item.id), item]));
  cartItems = cartItems.map((item) => {
    const product = localProducts.get(Number(item.id)) || PRODUCT_CATALOG[Number(item.id)];
    return product ? { ...product, id: Number(item.id), quantity: item.quantity } : null;
  }).filter(Boolean);

  if (!cartItems.length) {
    showMessage("Your cart is empty. Add products before placing an order.", "error");
  } else {
    showMessage("");
  }
  renderSummary(cartItems);
}

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  if (!user || user.isAnonymous) {
    window.location.href = "login.html?next=payment.html";
    return;
  }

  document.getElementById("email").value = user.email || "";
  document.getElementById("fullName").value = user.displayName || "";
  try {
    await loadCart(user);
  } catch (error) {
    console.error("Unable to load Firestore cart:", error);
    showMessage(error.message || "Unable to load your cart. Please try again.", "error");
    submitButton.disabled = true;
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  if (!currentUser || currentUser.isAnonymous) {
    showMessage("Please log in before placing your order.", "error");
    return;
  }
  if (!cartItems.length) {
    showMessage("Your cart is empty. Add products before placing an order.", "error");
    return;
  }

  submitButton.disabled = true;
  showMessage("Submitting your order...");
  try {
    const result = await createOrder({
      fullName: document.getElementById("fullName").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      address: document.getElementById("address").value.trim(),
      city: document.getElementById("city").value.trim(),
      postalCode: document.getElementById("postal").value.trim(),
      country: document.getElementById("country").value.trim()
    });
    localStorage.removeItem(CART_KEY);
    localStorage.removeItem(CART_OWNER_KEY);
    cartItems = [];
    renderSummary(cartItems);
    form.reset();
    document.getElementById("email").value = currentUser.email || "";
    showMessage(`Order received. No payment has been taken. Reference: ${result.data.orderId}`, "success");
  } catch (error) {
    console.error("Unable to place order:", error);
    showMessage(error.message || "Unable to place your order. Please try again.", "error");
    submitButton.disabled = false;
  }
});
