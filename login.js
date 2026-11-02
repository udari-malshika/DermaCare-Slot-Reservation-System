document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const toggleBtn = document.getElementById("togglePassword");
  const message = document.getElementById("loginMessage");

  // Show / Hide password
  toggleBtn.addEventListener("click", () => {
    const show = passwordInput.type === "password";
    passwordInput.type = show ? "text" : "password";
    toggleBtn.textContent = show ? "Hide" : "Show";
    toggleBtn.setAttribute("aria-pressed", String(show));
    toggleBtn.setAttribute("aria-label", show ? "Hide password" : "Show password");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    // Demo credentials only - not secure for real users.
    const demoEmail = "admin@dermacare.com";
    const demoPassword = "Demo123!";

    if (email === demoEmail && password === demoPassword) {
      // Save demo login status in this browser.
      localStorage.setItem("dermacareLoggedIn", "true");
      localStorage.setItem("dermacareUser", demoEmail);

      message.style.color = "#26734d";
      message.textContent = "Login successful! Opening your website...";

      // Redirect to the home page.
      setTimeout(() => {
        window.location.href = "home.html";
      }, 700);

    } else {
      message.style.color = "#b42318";
      message.textContent =
        "Invalid email or password. Please check your details and try again.";
    }
  });
});