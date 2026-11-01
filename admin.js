(function () {
  const sessionKey = "dermacare-session";
  const appointmentsKey = "dermacare-appointments";
  const usersKey = "dermacare-users";
  let session = null;
  try {
    session = JSON.parse(localStorage.getItem(sessionKey) || "null");
  } catch (error) {
    console.error("Unable to read the current session.", error);
  }

  if (!session || session.role !== "admin") {
    window.location.replace("admin-login.html");
    return;
  }

  const readArray = function (key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (error) {
      console.error("Unable to read dashboard data.", error);
      return [];
    }
  };

  let appointments = readArray(appointmentsKey).map((item, index) => ({
    ...item,
    id: item.id || "appointment-" + index,
    status: item.status || "Pending"
  }));
  let users = readArray(usersKey);
  const formatDate = (date) => date ? new Date(date + "T00:00:00").toLocaleDateString("en-GB") : "Not selected";

  function saveAppointments() {
    try {
      localStorage.setItem(appointmentsKey, JSON.stringify(appointments));
      return true;
    } catch (error) {
      console.error("Unable to save dashboard changes.", error);
      return false;
    }
  }

  function renderStats() {
    document.getElementById("totalAppointments").textContent = appointments.length;
    document.getElementById("pendingAppointments").textContent = appointments.filter((item) => item.status === "Pending").length;
    document.getElementById("confirmedAppointments").textContent = appointments.filter((item) => item.status === "Confirmed").length;
    document.getElementById("totalUsers").textContent = users.length;
  }

  function renderAppointments() {
    const filter = document.getElementById("statusFilter").value;
    const visible = appointments.filter((item) => filter === "All" || item.status === filter);
    const container = document.getElementById("appointmentsList");

    if (!visible.length) {
      container.innerHTML = '<p class="empty-state">No appointment requests match this filter.</p>';
      return;
    }

    container.innerHTML = visible.map((item) => `
      <article class="appointment-row">
        <div class="appointment-main">
          <strong>${escapeHtml(item.patientName)}</strong>
          <span>${escapeHtml(item.treatment)} · ${formatDate(item.date)} at ${escapeHtml(item.time)}</span>
          <small>${escapeHtml(item.email)} · ${escapeHtml(item.phone)}</small>
        </div>
        <div class="appointment-controls">
          <span class="status status-${item.status.toLowerCase()}">${escapeHtml(item.status)}</span>
          <select data-status-id="${escapeHtml(item.id)}" aria-label="Update appointment status">
            ${["Pending", "Confirmed", "Cancelled"].map((status) => `<option ${status === item.status ? "selected" : ""}>${status}</option>`).join("")}
          </select>
          <button class="delete-button" type="button" data-delete-id="${escapeHtml(item.id)}">Delete</button>
        </div>
      </article>
    `).join("");
  }

  function renderUsers() {
    const container = document.getElementById("usersList");
    if (!users.length) {
      container.innerHTML = '<p class="empty-state">No customer accounts have been registered yet.</p>';
      return;
    }
    container.innerHTML = users.map((user) => `
      <article class="user-row">
        <div class="user-avatar">${escapeHtml((user.name || "?").charAt(0).toUpperCase())}</div>
        <div><strong>${escapeHtml(user.name)}</strong><span>${escapeHtml(user.email)}</span></div>
        <small>Customer account</small>
      </article>
    `).join("");
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[character]));
  }

  document.getElementById("statusFilter").addEventListener("change", renderAppointments);
  document.getElementById("appointmentsList").addEventListener("change", (event) => {
    const id = event.target.dataset.statusId;
    if (!id) return;
    const appointment = appointments.find((item) => item.id === id);
    if (!appointment) return;
    const previousStatus = appointment.status;
    appointment.status = event.target.value;
    if (!saveAppointments()) {
      appointment.status = previousStatus;
      window.alert("Unable to save this status update in the browser.");
    }
    renderStats();
    renderAppointments();
  });
  document.getElementById("appointmentsList").addEventListener("click", (event) => {
    const id = event.target.dataset.deleteId;
    if (!id || !window.confirm("Delete this appointment request?")) return;
    const previousAppointments = appointments;
    appointments = appointments.filter((item) => item.id !== id);
    if (!saveAppointments()) {
      appointments = previousAppointments;
      window.alert("Unable to delete this appointment in the browser.");
    }
    renderStats();
    renderAppointments();
  });
  document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem(sessionKey);
    window.location.replace("admin-login.html");
  });

  renderStats();
  renderAppointments();
  renderUsers();
})();
