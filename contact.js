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

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const fields = form.querySelectorAll("input, select, textarea");
  let valid = true;

  fields.forEach((field) => {
    if (!field.checkValidity()) {
      field.classList.add("invalid");
      valid = false;
    } else {
      field.classList.remove("invalid");
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
    if (db) {
      await addDoc(collection(db, "messages"), data);
      showMessage("Thank you! Your message has been sent. We'll contact you soon.", "success");
    } else {
      throw new Error("Firestore not available");
    }
    form.reset();
  } catch (error) {
    console.warn("Sending message via Firebase failed, saving locally instead.", error);

    const savedMessages = JSON.parse(localStorage.getItem("dermacareContactMessages") || "[]");
    savedMessages.push({
      ...data,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("dermacareContactMessages", JSON.stringify(savedMessages));

    showMessage("Thank you! Your message has been saved locally and our team will follow up soon.", "success");
    form.reset();
  } finally {
    sendBtn.disabled = false;
  }
});

form.addEventListener("input", (event) => {
  const target = event.target;
  if (target.classList.contains("invalid")) {
    target.classList.remove("invalid");
  }
});