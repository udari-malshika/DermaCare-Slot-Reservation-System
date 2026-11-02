(function () {
  const storageKey = "dermacare-theme";
  const savedTheme = localStorage.getItem(storageKey);
  const theme = savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";

  document.documentElement.dataset.theme = theme;

  function updateToggle(button) {
    const isLight = document.documentElement.dataset.theme === "light";
    button.textContent = isLight ? "☾ Dark mode" : "☀ Light mode";
    button.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    button.setAttribute("aria-pressed", String(isLight));
  }

  function createToggle() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.addEventListener("click", function () {
      const nextTheme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem(storageKey, nextTheme);
      updateToggle(button);
    });
    document.body.appendChild(button);
    updateToggle(button);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createToggle);
  } else {
    createToggle();
  }
})();
