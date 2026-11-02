import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";

const appointmentHistory = document.getElementById("appointmentHistory");
const orderHistory = document.getElementById("orderHistory");
const appointmentMessage = document.getElementById("appointmentHistoryMessage");
const orderMessage = document.getElementById("orderHistoryMessage");
const functions = getFunctions(auth.app, "us-central1");
const cancelAppointment = httpsCallable(functions, "cancelAppointment");
const rescheduleAppointment = httpsCallable(functions, "rescheduleAppointment");
const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function makeElement(tag, text, className = "") {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) element.className = className;
  return element;
}

function timeToInput(time) {
  const match = /^(\d{2}):(\d{2}) (AM|PM)$/.exec(time);
  if (!match) return "";
  let hour = Number(match[1]) % 12;
  if (match[3] === "PM") hour += 12;
  return `${String(hour).padStart(2, "0")}:${match[2]}`;
}

function inputToTime(value) {
  const [rawHour, minute] = value.split(":").map(Number);
  const period = rawHour >= 12 ? "PM" : "AM";
  const hour = rawHour % 12 || 12;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${period}`;
}

function getLocalDateKey(date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

async function getSchedule() {
  const snapshot = await getDoc(doc(db, "clinicSettings", "weeklySchedule"));
  if (snapshot.exists() && snapshot.data().days) return snapshot.data().days;
  const times = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
    "03:00 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"
  ];
  return { "0": [], "1": times, "2": times, "3": times, "4": times, "5": times, "6": times };
}

async function updateRescheduleOptions(dateInput, timeSelect, originalDate, originalTime) {
  timeSelect.replaceChildren(new Option("Choose a time", ""));
  if (!dateInput.value) return;

  const [year, month, day] = dateInput.value.split("-").map(Number);
  const weekday = String(new Date(year, month - 1, day).getDay());
  const schedule = await getSchedule();
  const times = schedule[weekday] || [];
  const availability = await getDoc(doc(db, "appointmentAvailability", dateInput.value));
  const bookedTimes = availability.exists() ? availability.data().times || [] : [];

  times.filter((time) => !bookedTimes.includes(time) || (dateInput.value === originalDate && time === originalTime))
    .forEach((time) => timeSelect.add(new Option(time, timeToInput(time))));
}

function makeAppointmentCard(appointment) {
  const card = makeElement("article", "", "history-card");
  card.appendChild(makeElement("h3", appointment.treatment));
  card.appendChild(makeElement("p", `${appointment.date} · ${weekdayNames[new Date(`${appointment.date}T00:00:00`).getDay()]} · ${appointment.time}`));
  card.appendChild(makeElement("p", `Status: ${appointment.status}`));
  card.appendChild(makeElement("p", `Estimated total: LKR ${Number(appointment.total).toLocaleString("en-LK")}`));

  if (["pending", "confirmed"].includes(appointment.status)) {
    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.min = getLocalDateKey(new Date());
    dateInput.setAttribute("aria-label", "New appointment date");
    const timeSelect = document.createElement("select");
    timeSelect.setAttribute("aria-label", "New appointment time");
    const rescheduleButton = makeElement("button", "Reschedule");
    rescheduleButton.type = "button";
    rescheduleButton.disabled = true;

    dateInput.addEventListener("change", async () => {
      rescheduleButton.disabled = true;
      try {
        await updateRescheduleOptions(dateInput, timeSelect, appointment.date, appointment.time);
        rescheduleButton.disabled = false;
      } catch (error) {
        console.error("Unable to load rescheduling availability:", error);
        appointmentMessage.textContent = error.message || "Unable to load available times.";
      }
    });

    rescheduleButton.addEventListener("click", async () => {
      if (!dateInput.value || !timeSelect.value) {
        appointmentMessage.textContent = "Choose a new date and time.";
        return;
      }
      rescheduleButton.disabled = true;
      try {
        await rescheduleAppointment({
          appointmentId: appointment.id,
          date: dateInput.value,
          time: inputToTime(timeSelect.value)
        });
        appointmentMessage.textContent = "Reschedule request sent. The clinic must confirm the new time.";
        await loadHistory(auth.currentUser);
      } catch (error) {
        console.error("Unable to reschedule appointment:", error);
        appointmentMessage.textContent = error.message || "Unable to reschedule this appointment.";
        rescheduleButton.disabled = false;
      }
    });

    const cancelButton = makeElement("button", "Cancel appointment");
    cancelButton.type = "button";
    cancelButton.addEventListener("click", async () => {
      if (!window.confirm("Cancel this appointment?")) return;
      cancelButton.disabled = true;
      try {
        await cancelAppointment({ appointmentId: appointment.id });
        appointmentMessage.textContent = "Appointment cancelled.";
        await loadHistory(auth.currentUser);
      } catch (error) {
        console.error("Unable to cancel appointment:", error);
        appointmentMessage.textContent = error.message || "Unable to cancel this appointment.";
        cancelButton.disabled = false;
      }
    });

    card.append(dateInput, timeSelect, rescheduleButton, cancelButton);
  }
  return card;
}

function makeOrderCard(order) {
  const card = makeElement("article", "", "history-card");
  card.appendChild(makeElement("h3", `Order ${order.id}`));
  card.appendChild(makeElement("p", `Status: ${order.status} · Payment: ${order.paymentStatus}`));
  card.appendChild(makeElement("p", `Total: LKR ${Number(order.total).toLocaleString("en-LK")}`));
  card.appendChild(makeElement("p", order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")));
  return card;
}

async function loadHistory(user) {
  appointmentHistory.replaceChildren();
  orderHistory.replaceChildren();
  if (!user || user.isAnonymous) {
    appointmentMessage.textContent = "";
    orderMessage.textContent = "";
    return;
  }

  appointmentMessage.textContent = "Loading appointments...";
  orderMessage.textContent = "Loading orders...";
  try {
    const [appointments, orders] = await Promise.all([
      getDocs(query(collection(db, "appointments"), where("userId", "==", user.uid), limit(50))),
      getDocs(query(collection(db, "orders"), where("userId", "==", user.uid), limit(50)))
    ]);

    const appointmentItems = appointments.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
    appointmentItems.forEach((item) => appointmentHistory.appendChild(makeAppointmentCard(item)));
    appointmentMessage.textContent = appointmentItems.length ? "" : "No appointments yet.";

    const orderItems = orders.docs.map((item) => ({ id: item.id, ...item.data() }));
    orderItems.forEach((item) => orderHistory.appendChild(makeOrderCard(item)));
    orderMessage.textContent = orderItems.length ? "" : "No orders yet.";
  } catch (error) {
    console.error("Unable to load account history:", error);
    appointmentMessage.textContent = error.message || "Unable to load appointment history.";
    orderMessage.textContent = error.message || "Unable to load order history.";
  }
}

onAuthStateChanged(auth, (user) => {
  loadHistory(user);
});
