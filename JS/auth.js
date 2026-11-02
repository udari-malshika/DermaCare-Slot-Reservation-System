import { auth, db, ADMIN_EMAIL } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

function showMessage(element, message, type) {
  if (!element) return;
  element.textContent = message;
  element.dataset.type = type;
}

function firebaseMessage(error) {
  const messages = {
    "auth/email-already-in-use": "An account with this email already exists. Log in instead.",
    "auth/invalid-credential": "Email or password is incorrect.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Choose a password with at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Please wait and try again."
  };
  return messages[error.code] || error.message || "Something went wrong. Please try again.";
}

function getNextPage() {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.endsWith(".html") ? next : "appointment.html";
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = document.getElementById("message");
    const email = loginForm.elements.email.value.trim().toLowerCase();
    const password = loginForm.elements.password.value;
    const isAdminLogin = loginForm.dataset.role === "admin";
    const submitButton = loginForm.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    showMessage(message, "Signing in...", "info");

    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      if (isAdminLogin) {
        if (email !== ADMIN_EMAIL) {
          await signOut(auth);
          throw new Error(`Use the ${ADMIN_EMAIL} administrator account.`);
        }
        if (!credential.user.emailVerified) {
          await sendEmailVerification(credential.user);
          await signOut(auth);
          showMessage(message, "Please verify the administrator email using the link we sent, then sign in again.", "info");
          return;
        }
        window.location.href = "admin.html";
        return;
      }

      if (email === ADMIN_EMAIL) {
        await signOut(auth);
        throw new Error("Please use the admin login page for this account.");
      }

      window.location.href = getNextPage();
    } catch (error) {
      console.error("Firebase sign-in failed.", error);
      showMessage(message, firebaseMessage(error), "error");
    } finally {
      submitButton.disabled = false;
    }
  });
}

const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = document.getElementById("message");
    const name = signupForm.elements.name.value.trim();
    const email = signupForm.elements.email.value.trim().toLowerCase();
    const password = signupForm.elements.password.value;
    const submitButton = signupForm.querySelector('button[type="submit"]');

    if (email === ADMIN_EMAIL) {
      showMessage(message, "This email is reserved for the clinic administrator.", "error");
      return;
    }

    submitButton.disabled = true;
    showMessage(message, "Creating your account...", "info");

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      await setDoc(doc(db, "users", credential.user.uid), {
        name,
        email,
        createdAt: new Date().toISOString()
      });
      await signOut(auth);
      showMessage(message, "Account created. You can now log in.", "success");
      window.setTimeout(() => {
        window.location.href = "login.html";
      }, 600);
    } catch (error) {
      console.error("Firebase account creation failed.", error);
      showMessage(message, firebaseMessage(error), "error");
    } finally {
      submitButton.disabled = false;
    }
  });
}

const profileContent = document.getElementById("profileContent");
const logoutButton = document.getElementById("logoutButton");
if (profileContent && logoutButton) {
  onAuthStateChanged(auth, async (user) => {
    profileContent.replaceChildren();
    if (!user) {
      profileContent.innerHTML =
        '<p>You are not logged in yet.</p><a class="profile-login-link" href="login.html?next=profile.html">Log in to view your profile</a>';
      logoutButton.hidden = true;
      return;
    }

    try {
      const profile = await getDoc(doc(db, "users", user.uid));
      const nameValue = profile.exists() ? profile.data().name : user.displayName;
      const nameText = typeof nameValue === "string" && nameValue ? nameValue : user.email;

      const avatar = document.createElement("div");
      avatar.className = "profile-avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.textContent = nameText.charAt(0).toUpperCase();

      const details = document.createElement("div");
      const name = document.createElement("h2");
      name.textContent = nameText;
      const email = document.createElement("p");
      email.textContent = user.email;
      details.append(name, email);
      profileContent.append(avatar, details);
      logoutButton.hidden = false;
      logoutButton.onclick = async () => {
        try {
          await signOut(auth);
          window.location.reload();
        } catch (error) {
          console.error("Firebase sign-out failed.", error);
          window.alert("Unable to log out. Please try again.");
        }
      };
    } catch (error) {
      console.error("Unable to load the Firebase profile.", error);
      profileContent.textContent = "Unable to load your profile. Please try again.";
    }
  });
}

const resetForm = document.getElementById("resetPasswordForm");
if (resetForm) {
  resetForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = document.getElementById("message");
    const email = resetForm.elements.email.value.trim().toLowerCase();

    try {
      await sendPasswordResetEmail(auth, email);
      showMessage(message, "Password reset email sent. Check your inbox.", "success");
    } catch (error) {
      console.error("Firebase password reset failed.", error);
      showMessage(message, firebaseMessage(error), "error");
    }
  });
}
