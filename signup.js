
import { initializeApp }
    from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAv65a5ktTExi-WUq68_K1DaAmXUGXoDhk",
  authDomain: "dermocare-c8a51.firebaseapp.com",
  projectId: "dermocare-c8a51",
  storageBucket: "dermocare-c8a51.firebasestorage.app",
  messagingSenderId: "22556805907",
  appId: "1:22556805907:web:39ffcfcd39a555b06e68e6",
  measurementId: "G-MEM8XV9W6M"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const form = document.getElementById("signupForm");
const message = document.getElementById("message");
const button = document.getElementById("signupBtn");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        message.textContent = "Passwords do not match!";
        return;
    }

    button.disabled = true;
    message.textContent = "Creating your account...";

    try {
        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        await updateProfile(userCredential.user, {
            displayName: name
        });

        message.textContent = "Account created successfully!";

        window.location.href = "login.html";

    } catch (error) {
        const errors = {
            "auth/email-already-in-use":
                "This email is already registered.",

            "auth/invalid-email":
                "Please enter a valid email address.",

            "auth/weak-password":
                "Password must be stronger.",

            "auth/operation-not-allowed":
                "Enable Email/Password in Firebase Authentication.",

            "auth/network-request-failed":
                "Check your internet connection."
        };

        message.textContent =
            errors[error.code] ||
            "Account creation failed. Please try again.";

        console.error("Signup error:", error.code);

    } finally {
        button.disabled = false;
    }
});
