"use strict";

(() => {
    const $ = (id) => document.getElementById(id);

    const STORAGE_KEY = "dermacareAppointments";
    const MAX_DAYS_AHEAD = 60;
    const CLOSED_WEEKDAYS = [0];
    const HOLIDAYS = ["01-01", "02-04", "05-01", "12-25"];
    const START_OF_DAY = 9 * 60;
    const END_OF_DAY = 20 * 60 + 30;

    const TIME_GROUPS = {
        morning: ["10:15 AM", "11:00 AM"],
        afternoon: ["12:30 PM", "1:00 PM", "2:00 PM", "2:15 PM", "4:00 PM"],
        evening: ["5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM"]
    };

    const MONTH_NAMES = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const state = {
        currentMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        selectedDate: null,
        selectedTime: null,
        appointments: loadAppointments()
    };

    const elements = {
        monthTitle: $("monthTitle"),
        calendar: $("calendar"),
        selectedDate: $("selectedDate"),
        summaryService: $("summaryService"),
        summaryDate: $("summaryDate"),
        summaryTime: $("summaryTime"),
        bookingForm: $("bookingForm"),
        service: $("service"),
        customerName: $("customerName"),
        phone: $("phone"),
        email: $("email"),
        notes: $("notes"),
        message: $("message"),
        appointmentsList: $("appointmentsList"),
        appointmentCount: $("appointmentCount"),
        prevMonth: $("prevMonth"),
        nextMonth: $("nextMonth")
    };

    function loadAppointments() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    }

    function saveAppointments() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.appointments));
    }

    function pad(value) {
        return String(value).padStart(2, "0");
    }

    function formatDateKey(date) {
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }

    function parseDateKey(key) {
        const [year, month, day] = key.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    function formatDisplayDate(date) {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    }

    function isWeekend(date) {
        return date.getDay() === 0 || date.getDay() === 6;
    }

    function isHoliday(date) {
        const monthDay = `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
        return HOLIDAYS.includes(monthDay);
    }

    function isBeforeToday(date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    }

    function isBeyondBookingWindow(date) {
        const limit = new Date();
        limit.setHours(0, 0, 0, 0);
        limit.setDate(limit.getDate() + MAX_DAYS_AHEAD);
        return date > limit;
    }

    function isDateBlocked(date) {
        return (
            isBeforeToday(date) ||
            isWeekend(date) ||
            CLOSED_WEEKDAYS.includes(date.getDay()) ||
            isHoliday(date) ||
            isBeyondBookingWindow(date)
        );
    }

    function toMinutes(timeText) {
        const match = String(timeText).match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
        if (!match) return 0;
        let hour = Number(match[1]);
        const minute = Number(match[2]);
        const suffix = match[3].toUpperCase();
        if (suffix === "PM" && hour !== 12) hour += 12;
        if (suffix === "AM" && hour === 12) hour = 0;
        return hour * 60 + minute;
    }

    function timeIsAvailable(dateKeyValue, timeText) {
        const appointmentDate = parseDateKey(dateKeyValue);
        const selectedMinutes = toMinutes(timeText);
        const dayStart = START_OF_DAY;
        const dayEnd = END_OF_DAY;

        if (selectedMinutes < dayStart || selectedMinutes > dayEnd) {
            return false;
        }

        const chosenDate = formatDateKey(appointmentDate);
        const existing = state.appointments.filter((appt) => appt.date === chosenDate && appt.time === timeText);
        return existing.length === 0;
    }

    function renderCalendar() {
        const year = state.currentMonth.getFullYear();
        const month = state.currentMonth.getMonth();
        elements.monthTitle.textContent = `${MONTH_NAMES[month]} ${year}`;

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startWeekDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        const fragment = document.createDocumentFragment();

        DAY_NAMES.forEach((day) => {
            const label = document.createElement("div");
            label.className = "day-name";
            label.textContent = day;
            fragment.appendChild(label);
        });

        for (let i = 0; i < startWeekDay; i += 1) {
            const blank = document.createElement("div");
            blank.className = "calendar-day empty";
            blank.setAttribute("aria-hidden", "true");
            fragment.appendChild(blank);
        }

        for (let day = 1; day <= totalDays; day += 1) {
            const button = document.createElement("button");
            const date = new Date(year, month, day);
            const key = formatDateKey(date);
            const isSelected = state.selectedDate === key;
            const blocked = isDateBlocked(date);

            button.type = "button";
            button.className = `calendar-day ${isSelected ? "selected" : ""}`;
            button.textContent = String(day);
            button.disabled = blocked;

            if (!blocked) {
                button.addEventListener("click", () => {
                    state.selectedDate = key;
                    state.selectedTime = null;
                    renderCalendar();
                    renderTimeSlots();
                    updateSummary();
                });
            }

            fragment.appendChild(button);
        }

        elements.calendar.innerHTML = "";
        elements.calendar.appendChild(fragment);
    }

    function renderTimeSlots() {
        const groups = ["morning", "afternoon", "evening"];

        groups.forEach((group) => {
            const container = $(group);
            if (!container) return;

            container.innerHTML = "";
            const times = TIME_GROUPS[group];

            times.forEach((time) => {
                const slot = document.createElement("button");
                slot.type = "button";
                slot.className = `time-slot ${state.selectedTime === time ? "selected" : ""}`;
                slot.textContent = time;

                const isBlocked = state.selectedDate ? !timeIsAvailable(state.selectedDate, time) : false;
                slot.disabled = !state.selectedDate || isBlocked;

                slot.addEventListener("click", () => {
                    if (!state.selectedDate || slot.disabled) return;
                    state.selectedTime = time;
                    renderTimeSlots();
                    updateSummary();
                });

                container.appendChild(slot);
            });
        });
    }

    function updateSummary() {
        const serviceValue = elements.service.value || "Not selected";
        elements.summaryService.textContent = serviceValue === "" ? "Not selected" : serviceValue;
        elements.summaryDate.textContent = state.selectedDate ? formatDisplayDate(parseDateKey(state.selectedDate)) : "Not selected";
        elements.summaryTime.textContent = state.selectedTime || "Not selected";

        if (elements.selectedDate) {
            elements.selectedDate.textContent = state.selectedDate ? formatDisplayDate(parseDateKey(state.selectedDate)) : "Choose a date";
        }
    }

    function renderAppointments() {
        const list = elements.appointmentsList;
        list.innerHTML = "";

        if (!state.appointments.length) {
            list.innerHTML = '<p class="empty-message">No appointments booked yet.</p>';
            elements.appointmentCount.textContent = "0 appointments";
            return;
        }

        state.appointments
            .slice()
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .forEach((appointment) => {
                const item = document.createElement("div");
                item.className = "appointment-item";

                const heading = document.createElement("h3");
                heading.textContent = appointment.service;

                const details = document.createElement("p");
                details.textContent = `${appointment.dateText} • ${appointment.time}`;

                const meta = document.createElement("p");
                meta.textContent = `${appointment.name} • ${appointment.phone}`;

                const badge = document.createElement("span");
                badge.className = "status-badge";
                badge.textContent = "Confirmed";

                const cancelButton = document.createElement("button");
                cancelButton.type = "button";
                cancelButton.className = "cancel-button";
                cancelButton.textContent = "Cancel";
                cancelButton.addEventListener("click", () => {
                    state.appointments = state.appointments.filter((appt) => appt.id !== appointment.id);
                    saveAppointments();
                    renderAppointments();
                    renderTimeSlots();
                });

                item.appendChild(heading);
                item.appendChild(details);
                item.appendChild(meta);
                item.appendChild(badge);
                item.appendChild(cancelButton);
                list.appendChild(item);
            });

        elements.appointmentCount.textContent = `${state.appointments.length} appointment${state.appointments.length === 1 ? "" : "s"}`;
    }

    function saveDraft() {
        const draft = {
            selectedDate: state.selectedDate,
            selectedTime: state.selectedTime,
            service: elements.service.value,
            customerName: elements.customerName.value,
            phone: elements.phone.value,
            email: elements.email.value,
            notes: elements.notes.value
        };
        localStorage.setItem("dermacareDraft", JSON.stringify(draft));
    }

    function restoreDraft() {
        try {
            const draft = JSON.parse(localStorage.getItem("dermacareDraft") || "null");
            if (!draft) return;

            if (draft.service) elements.service.value = draft.service;
            if (draft.customerName) elements.customerName.value = draft.customerName;
            if (draft.phone) elements.phone.value = draft.phone;
            if (draft.email) elements.email.value = draft.email;
            if (draft.notes) elements.notes.value = draft.notes;
            if (draft.selectedDate) state.selectedDate = draft.selectedDate;
            if (draft.selectedTime) state.selectedTime = draft.selectedTime;
        } catch {
            // Ignore invalid saved draft.
        }
    }

    function validateForm() {
        if (!elements.service.value) {
            throw new Error("Please select a treatment.");
        }

        if (!state.selectedDate) {
            throw new Error("Please select a date.");
        }

        if (!state.selectedTime) {
            throw new Error("Please select a time slot.");
        }

        if (!elements.customerName.value.trim()) {
            throw new Error("Please enter your full name.");
        }

        const phoneValue = elements.phone.value.trim();
        if (!/^\+?[0-9\s()-]{9,16}$/.test(phoneValue)) {
            throw new Error("Please enter a valid phone number.");
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(elements.email.value.trim())) {
            throw new Error("Please enter a valid email address.");
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        try {
            validateForm();

            const appointment = {
                id: Date.now().toString(),
                service: elements.service.value,
                date: state.selectedDate,
                dateText: formatDisplayDate(parseDateKey(state.selectedDate)),
                time: state.selectedTime,
                name: elements.customerName.value.trim(),
                phone: elements.phone.value.trim(),
                email: elements.email.value.trim(),
                notes: elements.notes.value.trim(),
                createdAt: new Date().toISOString()
            };

            state.appointments.push(appointment);
            saveAppointments();
            renderAppointments();

            localStorage.removeItem("dermacareDraft");
            elements.bookingForm.reset();
            state.selectedDate = null;
            state.selectedTime = null;
            renderCalendar();
            renderTimeSlots();
            updateSummary();

            elements.message.textContent = "Appointment booked successfully.";
            elements.message.style.color = "#23834d";
        } catch (error) {
            elements.message.textContent = error.message;
            elements.message.style.color = "#b83232";
        }
    }

    function bindEvents() {
        elements.service.addEventListener("change", () => {
            updateSummary();
            saveDraft();
        });

        [elements.customerName, elements.phone, elements.email, elements.notes].forEach((input) => {
            input.addEventListener("input", saveDraft);
        });

        elements.bookingForm.addEventListener("submit", handleSubmit);

        elements.prevMonth.addEventListener("click", () => {
            state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() - 1, 1);
            renderCalendar();
        });

        elements.nextMonth.addEventListener("click", () => {
            state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() + 1, 1);
            renderCalendar();
        });
    }

    function init() {
        restoreDraft();
        bindEvents();
        renderCalendar();
        renderTimeSlots();
        updateSummary();
        renderAppointments();
    }

    init();
})();
