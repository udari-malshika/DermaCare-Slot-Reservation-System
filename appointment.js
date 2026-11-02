document.addEventListener("DOMContentLoaded", () => {
  const treatmentButtons = [...document.querySelectorAll(".treatment")];

  const searchInput = document.getElementById("treatmentSearch");
  const calendarGrid = document.getElementById("calendarGrid");
  const monthLabel = document.getElementById("monthLabel");
  const slotsContainer = document.getElementById("slots");
  const selectedDateLabel = document.getElementById("selectedDateLabel");
  const bookingForm = document.getElementById("bookingForm");
  const formMessage = document.getElementById("formMessage");

  const consultationFee = 2000;

  const timeSlots = [
    {
      period: "Morning",
      slots: ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM"]
    },
    {
      period: "Afternoon",
      slots: ["12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM"]
    },
    {
      period: "Evening",
      slots: ["04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"]
    }
  ];

  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  let selectedTreatment = treatmentButtons.find(
    (button) => button.classList.contains("selected")
  ) || treatmentButtons[0];

  const requestedTreatment = new URLSearchParams(window.location.search).get("treatment");
  if (requestedTreatment) {
    const requestedButton = treatmentButtons.find(
      (button) => button.dataset.treatment === requestedTreatment
    );

    if (requestedButton) {
      selectedTreatment = requestedButton;
      treatmentButtons.forEach((button) => button.classList.remove("selected"));
      requestedButton.classList.add("selected");
    }
  }

  let selectedDate = "";
  let selectedTime = "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);

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
      const name = selectedTreatment.dataset.treatment;
      const price = Number(selectedTreatment.dataset.price);
      const duration = selectedTreatment.dataset.duration;

      document.getElementById("summaryTreatment").textContent = name;
      document.getElementById("summaryDuration").textContent = duration + " minutes";
      document.getElementById("serviceCost").textContent = formatMoney(price);
      document.getElementById("totalCost").textContent = formatMoney(price + consultationFee);
    }

    document.getElementById("consultationCost").textContent = formatMoney(consultationFee);
    document.getElementById("summaryDate").textContent = formatDate(selectedDate);
    document.getElementById("summaryTime").textContent = selectedTime || "Not selected";
  }

  treatmentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      treatmentButtons.forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      selectedTreatment = button;
      formMessage.textContent = "";
      updateSummary();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();

      treatmentButtons.forEach((button) => {
        const matches = button.textContent.toLowerCase().includes(query);
        button.hidden = !matches;
      });
    });
  }

  function renderCalendar() {
    const year = displayedMonth.getFullYear();
    const month = displayedMonth.getMonth();

    monthLabel.textContent = displayedMonth.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });

    calendarGrid.innerHTML = "";

    weekdays.forEach((day) => {
      const heading = document.createElement("span");
      heading.className = "weekday";
      heading.textContent = day;
      calendarGrid.appendChild(heading);
    });

    const firstDay = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingOffset = (firstDay.getDay() + 6) % 7;

    for (let i = 0; i < startingOffset; i++) {
      calendarGrid.appendChild(document.createElement("span"));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const key = getDateKey(year, month, day);

      const button = document.createElement("button");
      button.type = "button";
      button.textContent = String(day);
      button.setAttribute("aria-label", formatDate(key));

      const isPast = date < today;
      const isSunday = date.getDay() === 0;
      button.disabled = isPast || isSunday;

      if (isSunday) {
        button.title = "Clinic availability must be checked";
      }

      if (key === selectedDate) {
        button.classList.add("selected");
        button.setAttribute("aria-pressed", "true");
      } else {
        button.setAttribute("aria-pressed", "false");
      }

      button.addEventListener("click", () => {
        if (button.disabled) return;

        selectedDate = key;
        selectedTime = "";
        formMessage.textContent = "";
        renderCalendar();
        renderSlots();
        updateSummary();
      });

      calendarGrid.appendChild(button);
    }

    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const prevButton = document.getElementById("prevMonth");
    if (prevButton) {
      prevButton.disabled = displayedMonth <= currentMonth;
    }
  }

  const prevMonthButton = document.getElementById("prevMonth");
  if (prevMonthButton) {
    prevMonthButton.addEventListener("click", () => {
      const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      if (displayedMonth <= currentMonth) return;

      displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1);
      renderCalendar();
    });
  }

  const nextMonthButton = document.getElementById("nextMonth");
  if (nextMonthButton) {
    nextMonthButton.addEventListener("click", () => {
      displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1);
      renderCalendar();
    });
  }

  function renderSlots() {
    slotsContainer.innerHTML = "";

    selectedDateLabel.textContent = selectedDate ? formatDate(selectedDate) : "Choose a date first";

    if (!selectedDate) {
      const message = document.createElement("p");
      message.className = "small-note";
      message.textContent = "Select a calendar date to view available slots.";
      slotsContainer.appendChild(message);
      return;
    }

    timeSlots.forEach(({ period, slots }) => {
      const group = document.createElement("div");
      group.className = "slot-group";

      const title = document.createElement("div");
      title.className = "slot-group-title";
      title.textContent = period;
      group.appendChild(title);

      const slotGrid = document.createElement("div");
      slotGrid.className = "slot-grid";

      slots.forEach((time) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "slot";
        button.textContent = time;

        if (selectedTime === time) {
          button.classList.add("selected");
          button.setAttribute("aria-pressed", "true");
        } else {
          button.setAttribute("aria-pressed", "false");
        }

        button.addEventListener("click", () => {
          selectedTime = time;
          formMessage.textContent = "";
          renderSlots();
          updateSummary();
        });

        slotGrid.appendChild(button);
      });

      group.appendChild(slotGrid);
      slotsContainer.appendChild(group);
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!bookingForm.reportValidity()) return;

      if (!selectedTreatment) {
        formMessage.style.color = "#b42318";
        formMessage.textContent = "Please select a treatment.";
        return;
      }

      if (!selectedDate || !selectedTime) {
        formMessage.style.color = "#b42318";
        formMessage.textContent = "Please select an appointment date and time.";

        const dateCard = document.querySelector(".booking-main .card:nth-child(2)");
        if (dateCard) {
          dateCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      const name = document.getElementById("fullName").value.trim();
      const email = document.getElementById("email").value.trim();
      const phone = document.getElementById("phone").value.trim();

      const request = {
        patientName: name,
        email,
        phone,
        treatment: selectedTreatment.dataset.treatment,
        date: selectedDate,
        time: selectedTime,
        estimatedCost: Number(selectedTreatment.dataset.price) + consultationFee,
        notes: document.getElementById("notes").value.trim()
      };

      console.log("Demo appointment request:", request);

      formMessage.style.color = "#26734d";
      formMessage.textContent = "Your booking request has been prepared successfully. This is a demo only and not sent to the clinic.";
    });
  }

  const summaryConfirm = document.getElementById("summaryConfirm");
  if (summaryConfirm) {
    summaryConfirm.addEventListener("click", () => {
      bookingForm.requestSubmit();
    });
  }

  renderCalendar();
  renderSlots();
  updateSummary();
});
