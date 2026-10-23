
const treatments = document.querySelectorAll(".treatment");
const search = document.getElementById("treatmentSearch");
const calendarGrid = document.getElementById("calendarGrid");
const monthLabel = document.getElementById("monthLabel");
const slotsBox = document.getElementById("slots");

let selectedTreatment = document.querySelector(".treatment.selected");
let selectedDate = "";
let selectedTime = "";

let displayedMonth = new Date();
displayedMonth.setDate(1);

const timeSlots = [
  "09:00 AM", "10:30 AM",
  "01:00 PM", "02:30 PM",
  "04:00 PM", "05:30 PM"
];

const money = value =>
  "LKR " + Number(value).toLocaleString("en-LK") + ".00";

function updateSummary() {
  const price = Number(selectedTreatment.dataset.price);

  document.getElementById("summaryTreatment").textContent =
    selectedTreatment.dataset.treatment;

  document.getElementById("serviceCost").textContent = money(price);
  document.getElementById("totalCost").textContent = money(price + 2000);

  document.getElementById("summaryDate").textContent =
    selectedDate
      ? new Date(selectedDate + "T12:00:00").toLocaleDateString(
          "en-LK",
          { weekday: "long", month: "long", day: "numeric", year: "numeric" }
        )
      : "Select a date";

  document.getElementById("summaryTime").textContent =
    selectedTime || "Select a time slot";
}

treatments.forEach(button => {
  button.addEventListener("click", () => {
    treatments.forEach(item => item.classList.remove("selected"));
    button.classList.add("selected");
    selectedTreatment = button;
    updateSummary();
  });
});

// Search treatments
search.addEventListener("input", () => {
  const query = search.value.toLowerCase();

  treatments.forEach(button => {
    button.hidden = !button.textContent.toLowerCase().includes(query);
  });
});

// Calendar
const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function dateKey(year, month, day) {
  return [
    year,
    String(month + 1).padStart(2, "0"),
    String(day).padStart(2, "0")
  ].join("-");
}

function renderCalendar() {
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();

  monthLabel.textContent = displayedMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  calendarGrid.innerHTML = weekdays.map(day =>
    `<span class="weekday">${day}</span>`
  ).join("");

  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < offset; i++) {
    calendarGrid.insertAdjacentHTML("beforeend", "<span></span>");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const key = dateKey(year, month, day);
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = day;
    button.setAttribute("aria-label", date.toDateString());

    // Disable past dates and Sundays
    if (date < today || date.getDay() === 0) {
      button.disabled = true;
    }

    if (key === selectedDate) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {
      selectedDate = key;
      selectedTime = "";
      renderCalendar();
      renderSlots();
      updateSummary();
    });

    calendarGrid.appendChild(button);
  }
}

document.getElementById("prevMonth").addEventListener("click", () => {
  const now = new Date();
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  if (displayedMonth > currentMonth) {
    displayedMonth.setMonth(displayedMonth.getMonth() - 1);
    renderCalendar();
  }
});

document.getElementById("nextMonth").addEventListener("click", () => {
  displayedMonth.setMonth(displayedMonth.getMonth() + 1);
  renderCalendar();
});

// Available time slots (demo data, not live clinic availability)
function renderSlots() {
  slotsBox.innerHTML = "";

  if (!selectedDate) {
    slotsBox.innerHTML =
      "<p class='hint'>Choose a date first.</p>";
    return;
  }

  timeSlots.forEach(time => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "slot";
    button.textContent = time;

    if (selectedTime === time) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {
      selectedTime = time;
      renderSlots();
      updateSummary();
    });

    slotsBox.appendChild(button);
  });
}

// Confirm appointment request
function submitBooking(event) {
  event.preventDefault();

  const message = document.getElementById("formMessage");

  if (!selectedDate || !selectedTime) {
    message.style.color = "#b45309";
    message.textContent =
      "Please select your appointment date and time.";
    document.querySelector(".booking-form .panel:nth-child(2)")
      .scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();

  message.style.color = "#26734d";
  message.textContent =
    `Demo request prepared for ${name}. ` +
    `Treatment: ${selectedTreatment.dataset.treatment}; ` +
    `Date: ${selectedDate}; Time: ${selectedTime}. ` +
    "This has not been sent to the clinic. Connect a backend to save the booking.";

  console.log("Demo appointment request:", {
    name,
    email,
    phone: document.getElementById("phone").value.trim(),
    treatment: selectedTreatment.dataset.treatment,
    date: selectedDate,
    time: selectedTime,
    notes: document.getElementById("notes").value.trim()
  });
}

document.getElementById("bookingForm")
  .addEventListener("submit", submitBooking);

document.getElementById("summaryConfirm").addEventListener("click", () => {
  document.getElementById("bookingForm").requestSubmit();
});

renderCalendar();
renderSlots();
updateSummary();
