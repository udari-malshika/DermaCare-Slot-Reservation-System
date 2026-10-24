import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const form = document.getElementById("contactForm");
const sendBtn = document.getElementById("sendBtn");
const formMessage = document.getElementById("formMessage");

function showMessage(text, type) {
  formMessage.textContent = text;
  formMessage.className = type;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // validation
  const fields = form.querySelectorAll("input, select, textarea");
  let valid = true;
  fields.forEach((f) => {
    if (!f.checkValidity()) {
      f.classList.add("invalid");
      valid = false;
    } else {
      f.classList.remove("invalid");
    }
  });

  if (!valid) {
    showMessage("Please fill in all the fields correctly.", "error");
    return;
  }

  const data = {
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value.trim(),
    createdAt: serverTimestamp()
  };

  sendBtn.disabled = true;
  showMessage("Sending...", "");

  try {
    await addDoc(collection(db, "messages"), data);
    showMessage("Thank you! Your message has been sent. We'll contact you soon.", "success");
    form.reset();
  } catch (error) {
    console.error("Error sending message:", error);
    showMessage("Something went wrong. Please try again or call us.", "error");
  } finally {
    sendBtn.disabled = false;
  }
});

// remove red border when user types
form.addEventListener("input", (e) => e.target.classList.remove("invalid"));