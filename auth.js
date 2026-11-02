import { auth } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function showMessage(element, message, type) {
  if (!element) return;

  element.textContent = message;
  element.dataset.type = type;
}

function getAuthErrorMessage(error) {
  const messages = {
    "auth/email-already-in-use": "An account with this email already exists. Log in instead.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/invalid-email": "Enter a valid email address.",
    "auth/network-request-failed": "Unable to connect. Check your internet connection and try again.",
    "auth/operation-not-allowed": "Email and password sign-in is not enabled. Contact the site administrator.",
    "auth/too-many-requests": "Too many attempts. Please wait a while and try again.",
    "auth/weak-password": "Choose a stronger password with at least 6 characters."
  };

  return messages[error.code] || error.message || "Authentication failed. Please try again.";
}

function getNextPage() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.endsWith(".html") ? next : "appointment.html";
}

function setFormSubmitting(form, isSubmitting) {
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = isSubmitting;
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  const message = document.getElementById("message");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage(message, "", "");
    setFormSubmitting(loginForm, true);

    try {
      await signInWithEmailAndPassword(
        auth,
        normalizeEmail(loginForm.elements.email.value),
        loginForm.elements.password.value
      );

      showMessage(message, "Login successful. Redirecting...", "success");
      window.setTimeout(() => {
        window.location.href = getNextPage();
      }, 400);
    } catch (error) {
      console.error("Firebase login failed:", error);
      showMessage(message, getAuthErrorMessage(error), "error");
      setFormSubmitting(loginForm, false);
    }
  });
}

const signupForm = document.getElementById("signupForm");
if (signupForm) {
  const message = document.getElementById("message");

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage(message, "", "");
    setFormSubmitting(signupForm, true);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        normalizeEmail(signupForm.elements.email.value),
        signupForm.elements.password.value
      );

      await updateProfile(credential.user, {
        displayName: signupForm.elements.name.value.trim()
      });
      await signOut(auth);

      showMessage(message, "Account created. Redirecting to login...", "success");
      window.setTimeout(() => {
        window.location.href = "login.html";
      }, 600);
    } catch (error) {
      console.error("Firebase signup failed:", error);
      showMessage(message, getAuthErrorMessage(error), "error");
      setFormSubmitting(signupForm, false);
    }
  });
}

const profileContent = document.getElementById("profileContent");
const logoutButton = document.getElementById("logoutButton");
const profileMessage = document.getElementById("profileMessage");

if (profileContent && logoutButton) {
  profileContent.textContent = "Loading profile...";

  onAuthStateChanged(
    auth,
    (user) => {
      profileContent.replaceChildren();

      if (!user || user.isAnonymous) {
        const prompt = document.createElement("p");
        prompt.textContent = "You are not logged in yet.";

        const loginLink = document.createElement("a");
        loginLink.className = "profile-login-link";
        loginLink.href = "login.html?next=profile.html";
        loginLink.textContent = "Log in to view your profile";

        profileContent.append(prompt, loginLink);
        logoutButton.hidden = true;
        return;
      }

      const name = user.displayName || user.email || "DermoCare user";
      const avatar = document.createElement("div");
      avatar.className = "profile-avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.textContent = name.charAt(0).toUpperCase();

      const details = document.createElement("div");
      const nameHeading = document.createElement("h2");
      nameHeading.textContent = name;
      const email = document.createElement("p");
      email.textContent = user.email || "";
      details.append(nameHeading, email);
      profileContent.append(avatar, details);
      logoutButton.hidden = false;
    },
    (error) => {
      console.error("Unable to load Firebase profile:", error);
      profileContent.textContent = "Unable to load your profile. Please refresh and try again.";
      showMessage(profileMessage, error.message, "error");
    }
  );

  logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;
    showMessage(profileMessage, "", "");

    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase logout failed:", error);
      showMessage(profileMessage, getAuthErrorMessage(error), "error");
      logoutButton.disabled = false;
    }
  });
}
