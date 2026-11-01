(function () {
  const usersKey = "dermacare-users";
  const sessionKey = "dermacare-session";

  function getUsers() {
    try {
      const users = JSON.parse(localStorage.getItem(usersKey) || "[]");
      return Array.isArray(users) ? users : [];
    } catch (error) {
      console.error("Unable to read saved accounts.", error);
      return [];
    }
  }

  function saveUsers(users) {
    try {
      localStorage.setItem(usersKey, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error("Unable to save account.", error);
      return false;
    }
  }

  function normalizeEmail(email) {
    return email.trim().toLowerCase();
  }

  function showMessage(message, type) {
    const element = document.getElementById("message");
    element.textContent = message;
    element.dataset.type = type;
  }

  function getNextPage() {
    const next = new URLSearchParams(window.location.search).get("next");
    return next && next.endsWith(".html") ? next : "appointment.html";
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const email = normalizeEmail(loginForm.elements.email.value);
      const password = loginForm.elements.password.value;
      const user = getUsers().find((account) => account.email === email);

      if (!user || user.password !== password) {
        showMessage("Email or password is incorrect.", "error");
        return;
      }

      localStorage.setItem(sessionKey, JSON.stringify({
        name: user.name,
        email: user.email
      }));
      showMessage("Login successful. Redirecting...", "success");
      window.setTimeout(function () {
        window.location.href = getNextPage();
      }, 400);
    });
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = signupForm.elements.name.value.trim();
      const email = normalizeEmail(signupForm.elements.email.value);
      const password = signupForm.elements.password.value;
      const users = getUsers();

      if (users.some((account) => account.email === email)) {
        showMessage("An account with this email already exists. Log in instead.", "error");
        return;
      }

      users.push({ name: name, email: email, password: password });
      if (!saveUsers(users)) {
        showMessage("Unable to create the account in this browser. Please try again.", "error");
        return;
      }
      showMessage("Account created. Redirecting to login...", "success");
      window.setTimeout(function () {
        window.location.href = "login.html";
      }, 600);
    });
  }

  const profileContent = document.getElementById("profileContent");
  const logoutButton = document.getElementById("logoutButton");
  if (profileContent && logoutButton) {
    let session = null;
    try {
      session = JSON.parse(localStorage.getItem(sessionKey) || "null");
    } catch (error) {
      console.error("Unable to read the current session.", error);
    }

    if (!session || !session.name || !session.email) {
      profileContent.innerHTML =
        '<p>You are not logged in yet.</p><a class="profile-login-link" href="login.html?next=profile.html">Log in to view your profile</a>';
    } else {
      const avatar = document.createElement("div");
      avatar.className = "profile-avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.textContent = session.name.charAt(0).toUpperCase();

      const details = document.createElement("div");
      const name = document.createElement("h2");
      name.textContent = session.name;
      const email = document.createElement("p");
      email.textContent = session.email;
      details.append(name, email);
      profileContent.append(avatar, details);
      logoutButton.hidden = false;
      logoutButton.addEventListener("click", function () {
        localStorage.removeItem(sessionKey);
        window.location.reload();
      });
    }
  }
})();
