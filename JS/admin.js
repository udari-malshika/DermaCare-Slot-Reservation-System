import { auth, db, ADMIN_EMAIL } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

(function () {
  let appointments = [];
  let users = [];
  let orders = [];
  const formatDate = (date) => date ? new Date(date + "T00:00:00").toLocaleDateString("en-GB") : "Not selected";

  function renderDashboard() {
    renderStats();
    renderAppointments();
    renderUsers();
    renderOrders();
  }

  function renderStats() {
    document.getElementById("totalAppointments").textContent = appointments.length;
    document.getElementById("pendingAppointments").textContent = appointments.filter((item) => item.status === "Pending").length;
    document.getElementById("confirmedAppointments").textContent = appointments.filter((item) => item.status === "Confirmed").length;
    document.getElementById("totalUsers").textContent = users.length;
    document.getElementById("totalOrders").textContent = orders.length;
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

  function renderOrders() {
    const filter = document.getElementById("orderStatusFilter").value;
    const visible = orders.filter((item) => filter === "All" || item.status === filter);
    const container = document.getElementById("ordersList");

    if (!visible.length) {
      container.innerHTML = '<p class="empty-state">No product orders match this filter.</p>';
      return;
    }

    container.innerHTML = visible.map((order) => {
      const itemSummary = order.items.map((item) =>
        `${escapeHtml(item.name)} × ${Number(item.quantity)}`
      ).join(" · ");

      return `
        <article class="order-row">
          <div class="order-main">
            <div class="order-heading">
              <strong>${escapeHtml(order.id)}</strong>
              <span class="status status-${order.status.toLowerCase()}">${escapeHtml(order.status)}</span>
            </div>
            <span>${escapeHtml(order.customerName)} · ${escapeHtml(order.email)} · ${escapeHtml(order.phone)}</span>
            <span>${escapeHtml(order.address)}</span>
            <small>${itemSummary || "No items recorded"} · ${money(order.total)} · ${escapeHtml(order.paymentMethod)}</small>
          </div>
          <div class="order-controls">
            <select data-order-status-id="${escapeHtml(order.id)}" aria-label="Update order status">
              ${["Pending", "Processing", "Completed", "Cancelled"].map((status) =>
                `<option ${status === order.status ? "selected" : ""}>${status}</option>`
              ).join("")}
            </select>
            <button class="delete-button" type="button" data-delete-order-id="${escapeHtml(order.id)}">Delete</button>
          </div>
        </article>
      `;
    }).join("");
  }

  function money(amount) {
    return `LKR ${Number(amount || 0).toLocaleString("en-LK")}`;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[character]));
  }

  async function refreshDashboard() {
    try {
      const [appointmentSnapshot, userSnapshot, orderSnapshot] = await Promise.all([
        getDocs(collection(db, "appointments")),
        getDocs(collection(db, "users")),
        getDocs(collection(db, "orders"))
      ]);
      appointments = appointmentSnapshot.docs.map((item) => ({
        ...item.data(),
        id: item.id,
        status: ["Pending", "Confirmed", "Cancelled"].includes(item.data().status)
          ? item.data().status
          : "Pending"
      }));
      users = userSnapshot.docs.map((item) => item.data());
      orders = orderSnapshot.docs.map((item) => ({
        ...item.data(),
        documentId: item.id,
        id: item.data().id || item.id,
        status: ["Pending", "Processing", "Completed", "Cancelled"].includes(item.data().status)
          ? item.data().status
          : "Pending",
        items: Array.isArray(item.data().items) ? item.data().items : []
      }));
      renderDashboard();
    } catch (error) {
      console.error("Unable to load dashboard data from Firestore.", error);
      document.getElementById("dashboardMessage").textContent =
        "Unable to load dashboard data. Check your Firestore rules and connection.";
    }
  }

  function showActionError(action, error) {
    console.error(`Unable to ${action}.`, error);
    window.alert(`Unable to ${action}. Please try again.`);
  }

  document.getElementById("statusFilter").addEventListener("change", renderAppointments);
  document.getElementById("appointmentsList").addEventListener("change", async (event) => {
    const id = event.target.dataset.statusId;
    if (!id) return;
    try {
      await updateDoc(doc(db, "appointments", id), { status: event.target.value });
      await refreshDashboard();
    } catch (error) {
      showActionError("save this appointment status", error);
    }
  });
  document.getElementById("appointmentsList").addEventListener("click", async (event) => {
    const id = event.target.dataset.deleteId;
    if (!id || !window.confirm("Delete this appointment request?")) return;
    try {
      await deleteDoc(doc(db, "appointments", id));
      await refreshDashboard();
    } catch (error) {
      showActionError("delete this appointment", error);
    }
  });
  document.getElementById("orderStatusFilter").addEventListener("change", renderOrders);
  document.getElementById("ordersList").addEventListener("change", async (event) => {
    const id = event.target.dataset.orderStatusId;
    if (!id) return;
    const order = orders.find((item) => item.id === id);
    if (!order) return;
    try {
      await updateDoc(doc(db, "orders", order.documentId), { status: event.target.value });
      await refreshDashboard();
    } catch (error) {
      showActionError("save this order status", error);
    }
  });
  document.getElementById("ordersList").addEventListener("click", async (event) => {
    const id = event.target.dataset.deleteOrderId;
    if (!id || !window.confirm("Delete this product order?")) return;
    const order = orders.find((item) => item.id === id);
    if (!order) return;
    try {
      await deleteDoc(doc(db, "orders", order.documentId));
      await refreshDashboard();
    } catch (error) {
      showActionError("delete this order", error);
    }
  });
  document.getElementById("logoutButton").addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.replace("../HTML/admin-login.html");
    } catch (error) {
      showActionError("log out", error);
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL || !user.emailVerified) {
      window.location.replace("../HTML/admin-login.html");
      return;
    }
    document.getElementById("dashboardMessage").textContent = "";
    refreshDashboard();
  });
})();
