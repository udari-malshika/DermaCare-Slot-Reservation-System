document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  // Mobile navigation
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });
  }

  const form = document.getElementById("bookingForm");
  const dateInput = document.getElementById("bookingDate");
  const timeSelect = document.getElementById("bookingTime");
  const treatmentSelect = document.getElementById("treatmentSelect");
  const message = document.getElementById("bookingMessage");

  if (!form || !dateInput || !timeSelect || !treatmentSelect || !message) {
    return;
  }

  // Use local calendar date, avoiding UTC date differences.
  function getLocalDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  dateInput.min = getLocalDate();

  // Update minimum date if the page remains open overnight.
  dateInput.addEventListener("focus", function () {
    dateInput.min = getLocalDate();
  });

  // Select a treatment automatically when linked using ?treatment=
  const params = new URLSearchParams(window.location.search);
  const requestedTreatment = params.get("treatment");

  if (requestedTreatment) {
    const matchingOption = Array.from(treatmentSelect.options).find(
      option => option.value.toLowerCase() === requestedTreatment.toLowerCase()
    );

    if (matchingOption) {
      treatmentSelect.value = matchingOption.value;
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    message.classList.remove("visible");
    message.textContent = "";

    if (!form.reportValidity()) {
      return;
    }

    const selectedDate = dateInput.value;
    const selectedTime = timeSelect.value;

    if (selectedDate < getLocalDate()) {
      message.textContent = "Please choose today or a future date.";
      message.classList.add("visible");
      dateInput.focus();
      return;
    }

    const selected = new Date(selectedDate + "T00:00:00");
    const dateText = selected.toLocaleDateString("en-LK", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const timeText = timeSelect.options[timeSelect.selectedIndex].text;

    message.textContent =
      "Your appointment request is ready: " +
      treatmentSelect.value + " on " +
      dateText + " at " + timeText +
      ". Please contact the clinic to confirm availability.";

    message.classList.add("visible");
    message.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
});
