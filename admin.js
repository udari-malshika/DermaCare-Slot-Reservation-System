import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-functions.js";

const message = document.getElementById("adminMessage");
const rows = document.getElementById("appointmentRows");
const scheduleForm = document.getElementById("scheduleForm");
const functions = getFunctions(auth.app, "us-central1");
const updateStatus = httpsCallable(functions, "updateAppointmentStatus");
const updateSchedule = httpsCallable(functions, "updateWeeklySchedule");
const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const defaultSlots = "09:00 AM, 09:30 AM, 10:00 AM, 10:30 AM, 11:00 AM, 11:30 AM, 12:00 PM, 12:30 PM, 01:00 PM, 01:30 PM, 02:00 PM, 02:30 PM, 03:00 PM, 04:00 PM, 04:30 PM, 05:00 PM, 05:30 PM, 06:00 PM, 06:30 PM";

function showMessage(text, type = "") {
  message.textContent = text;
  message.dataset.type = type;
}

function addCell(row, value) {
  const cell = document.createElement("td");
  cell.textContent = value || "—";
  row.appendChild(cell);
  return cell;
}

function renderAppointments(appointments) {
  rows.replaceChildren();
  if (!appointments.length) {
    const row = document.createElement("tr");
    const cell = addCell(row, "No appointments found.");
    cell.colSpan = 6;
    rows.appendChild(row);
    return;
  }

  appointments.forEach((appointment) => {
    const row = document.createElement("tr");
    addCell(row, appointment.patientName);
    addCell(row, appointment.treatment);
    addCell(row, `${appointment.date} · ${appointment.time}`);
    addCell(row, `${appointment.email}\n${appointment.phone}`);
    addCell(row, appointment.status);
    const actions = document.createElement("td");
    const actionGroup = document.createElement("div");
    actionGroup.className = "admin-actions";

    if (appointment.status === "pending") {
      actionGroup.appendChild(createActionButton("Confirm", appointment.id, "confirmed"));
    }
    if (["pending", "confirmed"].includes(appointment.status)) {
      actionGroup.appendChild(createActionButton("Cancel", appointment.id, "cancelled"));
    }
    actions.appendChild(actionGroup);
    row.appendChild(actions);
    rows.appendChild(row);
  });
}

function createActionButton(label, appointmentId, status) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", async () => {
    button.disabled = true;
    showMessage(`${label}ing appointment...`);
    try {
      await updateStatus({ appointmentId, status });
      await loadAppointments();
      showMessage(`Appointment ${status}.`, "success");
    } catch (error) {
      console.error("Unable to update appointment:", error);
      showMessage(error.message || "Unable to update appointment.", "error");
      button.disabled = false;
    }
  });
  return button;
}

async function loadAppointments() {
  const appointmentQuery = query(collection(db, "appointments"), orderBy("date", "asc"), limit(200));
  const snapshot = await getDocs(appointmentQuery);
  renderAppointments(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
}

async function loadSchedule() {
  const snapshot = await getDoc(doc(db, "clinicSettings", "weeklySchedule"));
  const days = snapshot.exists() ? snapshot.data().days : null;
  for (let day = 0; day <= 6; day++) {
    const input = scheduleForm.querySelector(`[data-weekday="${day}"]`);
    if (day === 0) continue;
    input.value = days && Array.isArray(days[String(day)])
      ? days[String(day)].join(", ")
      : defaultSlots;
  }
}

scheduleForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const days = { "0": [] };
  for (let day = 1; day <= 6; day++) {
    days[String(day)] = scheduleForm.querySelector(`[data-weekday="${day}"]`)
      .value.split(",").map((time) => time.trim()).filter(Boolean);
  }

  const button = scheduleForm.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    await updateSchedule({ days });
    showMessage("Weekly clinic schedule saved.", "success");
  } catch (error) {
    console.error("Unable to save clinic schedule:", error);
    showMessage(error.message || "Unable to save clinic schedule.", "error");
  } finally {
    button.disabled = false;
  }
});

document.getElementById("adminLogout").addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (error) {
    console.error("Unable to sign out admin:", error);
    showMessage(error.message || "Unable to sign out.", "error");
  }
});

onAuthStateChanged(auth, async (user) => {
  if (!user || user.isAnonymous) {
    window.location.href = "login.html?next=admin.html";
    return;
  }

  try {
    const token = await user.getIdTokenResult();
    if (token.claims.admin !== true) {
      showMessage("This account does not have administrator access.", "error");
      rows.replaceChildren();
      return;
    }
    await Promise.all([loadAppointments(), loadSchedule()]);
    showMessage("Administrator access verified.", "success");
  } catch (error) {
    console.error("Unable to load admin dashboard:", error);
    showMessage(error.message || "Unable to load clinic dashboard.", "error");
  }
});
