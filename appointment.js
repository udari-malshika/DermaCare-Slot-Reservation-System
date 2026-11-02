import { auth, db } from "./firebase.js";
import { doc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  const treatmentButtons = [...document.querySelectorAll(".treatment")];
  const searchInput = document.getElementById("treatmentSearch");
  const calendarGrid = document.getElementById("calendarGrid");
  const monthLabel = document.getElementById("monthLabel");
  const slotsContainer = document.getElementById("slots");
  const selectedDateLabel = document.getElementById("selectedDateLabel");
  const bookingForm = document.getElementById("bookingForm");
  const formMessage = document.getElementById("formMessage");
  const functions = getFunctions(auth.app, "us-central1");
  const createAppointment = httpsCallable(functions, "createAppointment");
  const consultationFee = 2000;
  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const defaultSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"
  ];
  const defaultSchedule = {
    "0": [],
    "1": defaultSlots,
    "2": defaultSlots,
    "3": defaultSlots,
    "4": defaultSlots,
    "5": defaultSlots,
    "6": defaultSlots
  };

  let schedule = defaultSchedule;
  let selectedTreatment = treatmentButtons.find((button) => button.classList.contains("selected")) || treatmentButtons[0];
  let selectedDate = "";
  let selectedTime = "";
  let currentUser = null;
  let stopAvailabilityListener = null;
  let scheduleReady = false;
  let availabilityReady = false;

  const requestedTreatment = new URLSearchParams(window.location.search).get("treatment");
  if (requestedTreatment) {
    const requestedButton = treatmentButtons.find((button) => button.dataset.treatment === requestedTreatment);
    if (requestedButton) {
      selectedTreatment = requestedButton;
      treatmentButtons.forEach((button) => button.classList.remove("selected"));
      requestedButton.classList.add("selected");
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  function showMessage(message, type = "") {
    formMessage.textContent = message;
    formMessage.dataset.type = type;
  }

  function formatMoney(amount) {
    return "LKR " + Number(amount).toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function getDateKey(year, month, day) {
    return [year, String(month + 1).padStart(2, "0"), String(day).padStart(2, "0")].join("-");
  }

  function formatDate(dateKey) {
    if (!dateKey) return "Not selected";
    const [year, month, day] = dateKey.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function updateSummary() {
    if (selectedTreatment) {
      const price = Number(selectedTreatment.dataset.price);
      document.getElementById("summaryTreatment").textContent = selectedTreatment.dataset.treatment;
      document.getElementById("summaryDuration").textContent = `${selectedTreatment.dataset.duration} minutes`;
      document.getElementById("serviceCost").textContent = formatMoney(price);
      document.getElementById("totalCost").textContent = formatMoney(price + consultationFee);
    }
    document.getElementById("consultationCost").textContent = formatMoney(consultationFee);
    document.getElementById("summaryDate").textContent = formatDate(selectedDate);
    document.getElementById("summaryTime").textContent = selectedTime || "Not selected";
  }

  function renderCalendar() {
    const year = displayedMonth.getFullYear();
    const month = displayedMonth.getMonth();
    monthLabel.textContent = displayedMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    calendarGrid.replaceChildren();

    weekdays.forEach((day) => {
      const heading = document.createElement("span");
      heading.className = "weekday";
      heading.textContent = day;
      calendarGrid.appendChild(heading);
    });

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingOffset = (firstDay.getDay() + 6) % 7;
    for (let index = 0; index < startingOffset; index++) calendarGrid.appendChild(document.createElement("span"));

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const key = getDateKey(year, month, day);
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = String(day);
      button.setAttribute("aria-label", formatDate(key));
      button.disabled = !scheduleReady || date < today || !(schedule[String(date.getDay())] || []).length;
      button.setAttribute("aria-pressed", String(key === selectedDate));
      if (key === selectedDate) button.classList.add("selected");
      button.addEventListener("click", () => {
        if (button.disabled) return;
        selectedDate = key;
        selectedTime = "";
        showMessage("");
        renderCalendar();
        watchAvailability();
        updateSummary();
      });
      calendarGrid.appendChild(button);
    }

    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    document.getElementById("prevMonth").disabled = displayedMonth <= currentMonth;
  }

  function renderSlots(bookedTimes = []) {
    slotsContainer.replaceChildren();
    selectedDateLabel.textContent = selectedDate ? formatDate(selectedDate) : "Choose a date first";

    if (!selectedDate) {
      const prompt = document.createElement("p");
      prompt.className = "small-note";
      prompt.textContent = "Select a calendar date to view available slots.";
      slotsContainer.appendChild(prompt);
      return;
    }

    if (!scheduleReady) {
      const message = document.createElement("p");
      message.className = "small-note";
      message.textContent = "The clinic schedule is unavailable. Please try again later.";
      slotsContainer.appendChild(message);
      return;
    }

    if (!availabilityReady) {
      const message = document.createElement("p");
      message.className = "small-note";
      message.textContent = "Checking live availability...";
      slotsContainer.appendChild(message);
      return;
    }

    const times = schedule[String(new Date(`${selectedDate}T00:00:00`).getDay())] || [];
    if (!times.length) {
      const message = document.createElement("p");
      message.className = "small-note";
      message.textContent = "The clinic is closed on this date.";
      slotsContainer.appendChild(message);
      return;
    }

    const groups = [
      { title: "Morning", matches: (time) => time.endsWith("AM") },
      { title: "Afternoon", matches: (time) => time.endsWith("PM") && (Number(time.slice(0, 2)) === 12 || Number(time.slice(0, 2)) < 4) },
      { title: "Evening", matches: (time) => time.endsWith("PM") && Number(time.slice(0, 2)) >= 4 }
    ];

    groups.forEach(({ title, matches }) => {
      const groupTimes = times.filter(matches);
      if (!groupTimes.length) return;
      const group = document.createElement("div");
      group.className = "slot-group";
      const heading = document.createElement("div");
      heading.className = "slot-group-title";
      heading.textContent = title;
      const grid = document.createElement("div");
      grid.className = "slot-grid";

      groupTimes.forEach((time) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "slot";
        button.textContent = time;
        button.disabled = bookedTimes.includes(time);
        button.title = button.disabled ? "Already booked" : "";
        button.setAttribute("aria-pressed", String(selectedTime === time));
        if (selectedTime === time) button.classList.add("selected");
        button.addEventListener("click", () => {
          if (button.disabled) return;
          selectedTime = time;
          showMessage("");
          renderSlots(bookedTimes);
          updateSummary();
        });
        grid.appendChild(button);
      });
      group.append(heading, grid);
      slotsContainer.appendChild(group);
    });
  }

  function watchAvailability() {
    if (stopAvailabilityListener) stopAvailabilityListener();
    availabilityReady = false;
    if (!selectedDate) {
      renderSlots();
      return;
    }

    renderSlots();
    stopAvailabilityListener = onSnapshot(
      doc(db, "appointmentAvailability", selectedDate),
      (snapshot) => {
        const bookedTimes = snapshot.exists() ? snapshot.data().times || [] : [];
        if (bookedTimes.includes(selectedTime)) selectedTime = "";
        availabilityReady = true;
        renderSlots(bookedTimes);
        updateSummary();
      },
      (error) => {
        console.error("Unable to load slot availability:", error);
        availabilityReady = false;
        selectedTime = "";
        renderSlots();
        showMessage("Unable to load live availability. Please refresh and try again.", "error");
      }
    );
  }

  treatmentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      treatmentButtons.forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      selectedTreatment = button;
      showMessage("");
      updateSummary();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      treatmentButtons.forEach((button) => {
        button.hidden = !button.textContent.toLowerCase().includes(query);
      });
    });
  }

  document.getElementById("prevMonth").addEventListener("click", () => {
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    if (displayedMonth <= currentMonth) return;
    displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1);
    renderCalendar();
  });
  document.getElementById("nextMonth").addEventListener("click", () => {
    displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1);
    renderCalendar();
  });

  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    if (!selectedTreatment) {
      showMessage("Please select a treatment.", "error");
      return;
    }
    if (!selectedDate || !selectedTime) {
      showMessage("Please select an available appointment date and time.", "error");
      document.querySelector(".booking-main .card:nth-child(2)")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (!currentUser || currentUser.isAnonymous || currentUser.email !== auth.currentUser?.email) {
      showMessage("Please log in with your email and password to book.", "error");
      window.setTimeout(() => {
        window.location.href = `login.html?next=${encodeURIComponent("appointment.html")}`;
      }, 700);
      return;
    }

    const submitButton = bookingForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    showMessage("Submitting your appointment request...");
    try {
      const result = await createAppointment({
        patientName: document.getElementById("fullName").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        treatment: selectedTreatment.dataset.treatment,
        date: selectedDate,
        time: selectedTime,
        notes: document.getElementById("notes").value.trim()
      });
      showMessage(`Request received and awaiting clinic confirmation. Reference: ${result.data.appointmentId}`, "success");
      selectedTime = "";
      watchAvailability();
      renderCalendar();
      updateSummary();
    } catch (error) {
      console.error("Appointment request failed:", error);
      if (error.code === "functions/already-exists") {
        showMessage("That slot was just booked. Please choose another available time.", "error");
      } else {
        showMessage(error.message || "Unable to book this appointment. Please try again.", "error");
      }
      watchAvailability();
    } finally {
      submitButton.disabled = false;
    }
  });

  const summaryConfirm = document.getElementById("summaryConfirm");
  summaryConfirm?.addEventListener("click", () => bookingForm.requestSubmit());

  onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user && !user.isAnonymous) {
      document.getElementById("email").value = user.email || "";
      document.getElementById("email").readOnly = true;
      document.getElementById("fullName").value = user.displayName || document.getElementById("fullName").value;
    } else {
      document.getElementById("email").readOnly = false;
    }
  });

  try {
    const settings = await getDoc(doc(db, "clinicSettings", "weeklySchedule"));
    if (settings.exists() && settings.data().days) schedule = settings.data().days;
    scheduleReady = true;
  } catch (error) {
    console.error("Unable to load clinic schedule:", error);
    scheduleReady = false;
    showMessage("Clinic schedule unavailable. Deploy the latest Firestore rules, then refresh.", "error");
  }

  renderCalendar();
  renderSlots();
  updateSummary();
});
