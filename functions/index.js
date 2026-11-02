const { initializeApp } = require("firebase-admin/app");
const { FieldValue, getFirestore } = require("firebase-admin/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");

initializeApp();

const db = getFirestore();
const REGION = "us-central1";
const MAIL_COLLECTION = "mail";
const CONSULTATION_FEE = 2000;
const DELIVERY_FEE = 500;
const CLINIC_TIME_ZONE = "Asia/Colombo";
const WEEKLY_SCHEDULE = {
  "1": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"],
  "2": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"],
  "3": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"],
  "4": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"],
  "5": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"],
  "6": ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM"],
  "0": []
};
const TREATMENTS = {
  "CO2 Laser": { price: 35000, duration: 45 },
  "Carbon Laser Peel": { price: 15000, duration: 30 },
  "Botox & Fillers": { price: 25000, duration: 30 },
  "RF Microneedling": { price: 20000, duration: 60 },
  "Pigmentation Laser": { price: 18000, duration: 30 },
  "Laser Hair Removal": { price: 12000, duration: 30 },
  "PRP Therapy": { price: 22000, duration: 45 },
  "Chemical Peeling": { price: 10000, duration: 30 }
};
const PRODUCTS = {
  "1": { name: "Gentle Foaming Cleanser", price: 4200 },
  "2": { name: "Vitamin C Brightening Serum", price: 5850 },
  "3": { name: "Hydrating Barrier Cream", price: 6400 },
  "4": { name: "Mineral SPF 50 Shield", price: 3800 },
  "5": { name: "Advanced Retinol Serum", price: 3980 },
  "6": { name: "Daily Hydrating Cleanser", price: 3200 },
  "7": { name: "Oil Control Moisturizer", price: 4500 },
  "8": { name: "Daily Glow Sunscreen", price: 3500 },
  "9": { name: "Soothing Skin Serum", price: 5200 },
  "10": { name: "Centella Recovery Cream", price: 6100 },
  "11": { name: "Green Glow Essence", price: 5750 },
  "12": { name: "Pore Refining Serum", price: 4900 },
  "13": { name: "Barrier Repair Mask", price: 4700 },
  "14": { name: "Niacinamide Daily Essence", price: 5600 }
};

function requireUser(request) {
  if (!request.auth || request.auth.token.firebase.sign_in_provider !== "password") {
    throw new HttpsError("unauthenticated", "Sign in with your email and password to continue.");
  }

  return request.auth;
}

function requireAdmin(request) {
  const user = requireUser(request);
  if (user.token.admin !== true) {
    throw new HttpsError("permission-denied", "Administrator access is required.");
  }
  return user;
}

function requiredText(value, field, maxLength) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > maxLength) {
    throw new HttpsError("invalid-argument", `Enter a valid ${field}.`);
  }
  return value.trim();
}

function getSchedule(snapshot) {
  return snapshot.exists && snapshot.data().days ? snapshot.data().days : WEEKLY_SCHEDULE;
}

function slotDocumentId(date, time) {
  return `${date}_${time.replace(/[^0-9APM]/g, "")}`;
}

function datePartsInClinicTime(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: CLINIC_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);
  return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

function getClinicDateKey(date) {
  const parts = datePartsInClinicTime(date);
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function timeToMinutes(time) {
  const match = /^(0[1-9]|1[0-2]):(00|30) (AM|PM)$/.exec(time);
  if (!match) return -1;
  const hour = Number(match[1]) % 12 + (match[3] === "PM" ? 12 : 0);
  return hour * 60 + Number(match[2]);
}

function minutesToTime(minutes) {
  const period = minutes >= 720 ? "PM" : "AM";
  const hour = Math.floor(minutes / 60) % 12 || 12;
  return `${String(hour).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")} ${period}`;
}

function getReservedTimes(date, time, durationMinutes, schedule) {
  const [year, month, day] = date.split("-").map(Number);
  const weekday = String(new Date(Date.UTC(year, month - 1, day)).getUTCDay());
  const availableTimes = schedule[weekday];
  const start = timeToMinutes(time);
  const numberOfBlocks = Math.ceil(durationMinutes / 30);
  const reservedTimes = Array.from({ length: numberOfBlocks }, (_, index) => minutesToTime(start + index * 30));

  if (!Array.isArray(availableTimes) || reservedTimes.some((slot) => !availableTimes.includes(slot))) {
    throw new HttpsError("failed-precondition", "There is not enough clinic availability for this treatment.");
  }

  return reservedTimes;
}

function assertBookableSlot(date, time, schedule, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || timeToMinutes(time) < 0) {
    throw new HttpsError("invalid-argument", "Choose a valid appointment date and time.");
  }

  const [year, month, day] = date.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));
  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !== month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    throw new HttpsError("invalid-argument", "Choose a valid appointment date.");
  }

  const weekday = String(parsedDate.getUTCDay());
  if (!Array.isArray(schedule[weekday]) || !schedule[weekday].includes(time)) {
    throw new HttpsError("failed-precondition", "That date or time is not available.");
  }

  const nowParts = datePartsInClinicTime(now);
  const today = `${nowParts.year}-${nowParts.month}-${nowParts.day}`;
  if (
    date < today ||
    (date === today && timeToMinutes(time) <= Number(nowParts.hour) * 60 + Number(nowParts.minute))
  ) {
    throw new HttpsError("failed-precondition", "Choose a future appointment time.");
  }
}

function cleanEmail(value) {
  if (typeof value !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new HttpsError("invalid-argument", "A valid email address is required.");
  }
  return value.trim().toLowerCase();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  })[character]);
}

async function enqueueMail(id, to, subject, html) {
  const ref = db.collection(MAIL_COLLECTION).doc(id);
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists) {
      transaction.create(ref, {
        to: [to],
        message: { subject, html },
        createdAt: FieldValue.serverTimestamp()
      });
    }
  });
}

function appointmentEmail(data, subject, heading, message) {
  return `<h2>${heading}</h2><p>${escapeHtml(message)}</p><p><strong>${escapeHtml(data.treatment)}</strong><br>${escapeHtml(data.date)} at ${escapeHtml(data.time)}</p><p>We will contact you if the clinic needs any further information.</p>`;
}

exports.createAppointment = onCall({ region: REGION }, async (request) => {
  const user = requireUser(request);
  const patientName = requiredText(request.data.patientName, "full name", 120);
  const phone = requiredText(request.data.phone, "phone number", 30);
  const email = cleanEmail(user.token.email);
  const treatment = requiredText(request.data.treatment, "treatment", 80);
  const treatmentInfo = TREATMENTS[treatment];
  if (!treatmentInfo) throw new HttpsError("invalid-argument", "Choose a valid treatment.");

  const date = requiredText(request.data.date, "date", 10);
  const time = requiredText(request.data.time, "time", 8);
  const notes = typeof request.data.notes === "string" ? request.data.notes.trim().slice(0, 1000) : "";

  const settingsRef = db.doc("clinicSettings/weeklySchedule");
  const availabilityRef = db.collection("appointmentAvailability").doc(date);
  const appointmentRef = db.collection("appointments").doc();

  await db.runTransaction(async (transaction) => {
    const [settings, availability] = await Promise.all([
      transaction.get(settingsRef),
      transaction.get(availabilityRef)
    ]);
    assertBookableSlot(date, time, getSchedule(settings));
    const reservedTimes = getReservedTimes(date, time, treatmentInfo.duration, getSchedule(settings));
    const slotRefs = reservedTimes.map((slotTime) =>
      db.collection("appointmentSlots").doc(slotDocumentId(date, slotTime))
    );
    const slots = await Promise.all(slotRefs.map((slotRef) => transaction.get(slotRef)));
    if (slots.some((slot) => slot.exists)) {
      throw new HttpsError("already-exists", "That appointment time overlaps with a booking. Please choose another time.");
    }

    const occupied = availability.exists ? availability.data().times || [] : [];
    transaction.create(appointmentRef, {
      userId: user.uid,
      patientName,
      email,
      phone,
      treatment,
      treatmentPrice: treatmentInfo.price,
      durationMinutes: treatmentInfo.duration,
      consultationFee: CONSULTATION_FEE,
      total: treatmentInfo.price + CONSULTATION_FEE,
      notes,
      date,
      time,
      reservedTimes,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    slotRefs.forEach((slotRef, index) => {
      transaction.create(slotRef, { appointmentId: appointmentRef.id, date, time: reservedTimes[index] });
    });
    transaction.set(availabilityRef, {
      times: [...new Set([...occupied, ...reservedTimes])].sort()
    });
  });

  return { appointmentId: appointmentRef.id, status: "pending" };
});

exports.cancelAppointment = onCall({ region: REGION }, async (request) => {
  const user = requireUser(request);
  const appointmentId = requiredText(request.data.appointmentId, "appointment", 128);
  const appointmentRef = db.collection("appointments").doc(appointmentId);

  await db.runTransaction(async (transaction) => {
    const appointment = await transaction.get(appointmentRef);
    if (!appointment.exists) throw new HttpsError("not-found", "Appointment not found.");
    const data = appointment.data();
    if (data.userId !== user.uid) throw new HttpsError("permission-denied", "You can only cancel your own appointment.");
    if (!["pending", "confirmed"].includes(data.status)) {
      throw new HttpsError("failed-precondition", "This appointment can no longer be cancelled.");
    }

    const reservedTimes = data.reservedTimes || [data.time];
    const slotRefs = reservedTimes.map((time) =>
      db.collection("appointmentSlots").doc(slotDocumentId(data.date, time))
    );
    const availabilityRef = db.collection("appointmentAvailability").doc(data.date);
    const [slots, availability] = await Promise.all([
      Promise.all(slotRefs.map((slotRef) => transaction.get(slotRef))),
      transaction.get(availabilityRef)
    ]);
    slots.forEach((slot, index) => {
      if (slot.exists) transaction.delete(slotRefs[index]);
    });
    const times = availability.exists ? availability.data().times || [] : [];
    transaction.set(availabilityRef, {
      times: times.filter((time) => !reservedTimes.includes(time))
    });
    transaction.update(appointmentRef, {
      status: "cancelled",
      cancelledAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
  });

  return { status: "cancelled" };
});

exports.rescheduleAppointment = onCall({ region: REGION }, async (request) => {
  const user = requireUser(request);
  const appointmentId = requiredText(request.data.appointmentId, "appointment", 128);
  const date = requiredText(request.data.date, "date", 10);
  const time = requiredText(request.data.time, "time", 8);
  const appointmentRef = db.collection("appointments").doc(appointmentId);
  const settingsRef = db.doc("clinicSettings/weeklySchedule");
  const newAvailabilityRef = db.collection("appointmentAvailability").doc(date);

  await db.runTransaction(async (transaction) => {
    const [appointment, settings, newAvailability] = await Promise.all([
      transaction.get(appointmentRef),
      transaction.get(settingsRef),
      transaction.get(newAvailabilityRef)
    ]);
    if (!appointment.exists) throw new HttpsError("not-found", "Appointment not found.");
    const data = appointment.data();
    if (data.userId !== user.uid) throw new HttpsError("permission-denied", "You can only reschedule your own appointment.");
    if (!["pending", "confirmed"].includes(data.status)) {
      throw new HttpsError("failed-precondition", "This appointment can no longer be rescheduled.");
    }
    if (data.date === date && data.time === time) {
      throw new HttpsError("invalid-argument", "Choose a different appointment time.");
    }

    assertBookableSlot(date, time, getSchedule(settings));
    const schedule = getSchedule(settings);
    const newReservedTimes = getReservedTimes(date, time, data.durationMinutes || 30, schedule);
    const oldReservedTimes = data.reservedTimes || [data.time];
    const newSlotRefs = newReservedTimes.map((slotTime) =>
      db.collection("appointmentSlots").doc(slotDocumentId(date, slotTime))
    );
    const newSlots = await Promise.all(newSlotRefs.map((slotRef) => transaction.get(slotRef)));
    if (newSlots.some((slot) => slot.exists && slot.data().appointmentId !== appointmentId)) {
      throw new HttpsError("already-exists", "That appointment time overlaps with a booking. Please choose another time.");
    }

    const oldSlotRefs = oldReservedTimes.map((slotTime) =>
      db.collection("appointmentSlots").doc(slotDocumentId(data.date, slotTime))
    );
    const oldAvailabilityRef = db.collection("appointmentAvailability").doc(data.date);
    const oldSlots = await Promise.all(oldSlotRefs.map((slotRef) => transaction.get(slotRef)));
    const oldAvailability = data.date === date
      ? newAvailability
      : await transaction.get(oldAvailabilityRef);

    const oldSlotIds = new Set(oldReservedTimes.map((slotTime) => slotDocumentId(data.date, slotTime)));
    const newSlotIds = new Set(newReservedTimes.map((slotTime) => slotDocumentId(date, slotTime)));
    oldSlots.forEach((slot, index) => {
      const oldSlotId = slotDocumentId(data.date, oldReservedTimes[index]);
      if (slot.exists && !newSlotIds.has(oldSlotId)) transaction.delete(oldSlotRefs[index]);
    });
    const oldTimes = oldAvailability.exists ? oldAvailability.data().times || [] : [];
    const newTimes = newAvailability.exists ? newAvailability.data().times || [] : [];
    const remainingOldTimes = oldTimes.filter((slotTime) => !oldReservedTimes.includes(slotTime));
    if (data.date !== date) {
      transaction.set(oldAvailabilityRef, { times: remainingOldTimes });
    }
    newSlotRefs.forEach((slotRef, index) => {
      const newSlotId = slotDocumentId(date, newReservedTimes[index]);
      if (!oldSlotIds.has(newSlotId)) {
        transaction.create(slotRef, { appointmentId, date, time: newReservedTimes[index] });
      }
    });
    transaction.set(newAvailabilityRef, {
      times: [...new Set([...(data.date === date ? remainingOldTimes : newTimes), ...newReservedTimes])].sort()
    });
    transaction.update(appointmentRef, {
      date,
      time,
      reservedTimes: newReservedTimes,
      status: "pending",
      reminderSentAt: FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp()
    });
  });

  return { status: "pending" };
});

exports.updateAppointmentStatus = onCall({ region: REGION }, async (request) => {
  requireAdmin(request);
  const appointmentId = requiredText(request.data.appointmentId, "appointment", 128);
  const status = request.data.status;
  if (!["confirmed", "cancelled"].includes(status)) {
    throw new HttpsError("invalid-argument", "Choose a valid appointment status.");
  }

  const appointmentRef = db.collection("appointments").doc(appointmentId);
  await db.runTransaction(async (transaction) => {
    const appointment = await transaction.get(appointmentRef);
    if (!appointment.exists) throw new HttpsError("not-found", "Appointment not found.");
    const data = appointment.data();
    if (!["pending", "confirmed"].includes(data.status)) {
      throw new HttpsError("failed-precondition", "This appointment cannot be updated.");
    }

    if (status === "cancelled") {
      const reservedTimes = data.reservedTimes || [data.time];
      const slotRefs = reservedTimes.map((time) =>
        db.collection("appointmentSlots").doc(slotDocumentId(data.date, time))
      );
      const availabilityRef = db.collection("appointmentAvailability").doc(data.date);
      const [slots, availability] = await Promise.all([
        Promise.all(slotRefs.map((slotRef) => transaction.get(slotRef))),
        transaction.get(availabilityRef)
      ]);
      slots.forEach((slot, index) => {
        if (slot.exists) transaction.delete(slotRefs[index]);
      });
      const times = availability.exists ? availability.data().times || [] : [];
      transaction.set(availabilityRef, {
        times: times.filter((time) => !reservedTimes.includes(time))
      });
    }

    transaction.update(appointmentRef, {
      status,
      updatedAt: FieldValue.serverTimestamp()
    });
  });

  return { status };
});

exports.updateWeeklySchedule = onCall({ region: REGION }, async (request) => {
  requireAdmin(request);
  const days = request.data.days;
  if (!days || typeof days !== "object" || Array.isArray(days)) {
    throw new HttpsError("invalid-argument", "A weekly schedule is required.");
  }

  const cleanedDays = {};
  for (let day = 0; day <= 6; day++) {
    const slots = days[String(day)];
    if (!Array.isArray(slots) || slots.length > 40 || slots.some((slot) => typeof slot !== "string" || timeToMinutes(slot) < 0)) {
      throw new HttpsError("invalid-argument", "Each day must contain valid appointment times.");
    }
    if (new Set(slots).size !== slots.length) {
      throw new HttpsError("invalid-argument", "Appointment times must not be duplicated.");
    }
    cleanedDays[String(day)] = day === 0 ? [] : [...slots].sort((a, b) => timeToMinutes(a) - timeToMinutes(b));
  }

  await db.doc("clinicSettings/weeklySchedule").set({
    days: cleanedDays,
    updatedAt: FieldValue.serverTimestamp()
  });
  return { updated: true };
});

exports.createOrder = onCall({ region: REGION }, async (request) => {
  const user = requireUser(request);
  const fullName = requiredText(request.data.fullName, "full name", 120);
  const email = cleanEmail(user.token.email);
  const phone = requiredText(request.data.phone, "phone number", 30);
  const address = requiredText(request.data.address, "street address", 240);
  const city = requiredText(request.data.city, "city", 100);
  const postalCode = requiredText(request.data.postalCode, "postal code", 20);
  const country = requiredText(request.data.country, "country", 80);
  const cartRef = db.collection("carts").doc(user.uid);
  const orderRef = db.collection("orders").doc();

  await db.runTransaction(async (transaction) => {
    const cartSnapshot = await transaction.get(cartRef);
    const requestedItems = cartSnapshot.exists ? cartSnapshot.data().items : [];
    if (!Array.isArray(requestedItems) || requestedItems.length < 1 || requestedItems.length > 50) {
      throw new HttpsError("failed-precondition", "Your Firestore cart is empty. Add items before placing an order.");
    }

    const items = requestedItems.map((item) => {
      const product = PRODUCTS[String(item.id)];
      const quantity = Number(item.quantity);
      if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        throw new HttpsError("invalid-argument", "Your cart contains an invalid product or quantity.");
      }
      return { id: Number(item.id), name: product.name, price: product.price, quantity };
    });
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    transaction.create(orderRef, {
      userId: user.uid,
      customer: { fullName, email, phone },
      shippingAddress: { address, city, postalCode, country },
      items,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total: subtotal + DELIVERY_FEE,
      status: "awaiting_payment",
      paymentStatus: "not_paid",
      createdAt: FieldValue.serverTimestamp()
    });
    transaction.delete(cartRef);
  });

  return { orderId: orderRef.id, status: "awaiting_payment" };
});

exports.emailAppointmentCreated = onDocumentCreated({
  document: "appointments/{appointmentId}",
  region: REGION
}, async (event) => {
  const appointment = event.data.data();
  await enqueueMail(
    `${event.params.appointmentId}_created`,
    appointment.email,
    "Appointment request received",
    appointmentEmail(appointment, "Appointment request received", "We received your request", "Your appointment is pending clinic confirmation.")
  );
});

exports.emailAppointmentUpdated = onDocumentUpdated({
  document: "appointments/{appointmentId}",
  region: REGION
}, async (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();
  if (before.status === after.status && (before.date === after.date && before.time === after.time)) return;

  const cancelled = after.status === "cancelled";
  await enqueueMail(
    `${event.params.appointmentId}_${event.id}`,
    after.email,
    cancelled ? "Appointment cancelled" : after.status === "confirmed" ? "Appointment confirmed" : "Appointment updated",
    appointmentEmail(
      after,
      cancelled ? "Appointment cancelled" : after.status === "confirmed" ? "Appointment confirmed" : "Appointment updated",
      cancelled ? "Your appointment was cancelled" : after.status === "confirmed" ? "Your appointment is confirmed" : "Your appointment details changed",
      cancelled ? "The clinic has cancelled this appointment." : after.status === "confirmed" ? "The clinic has confirmed your appointment." : "Your rescheduled appointment is awaiting clinic confirmation."
    )
  );
});

exports.emailOrderCreated = onDocumentCreated({
  document: "orders/{orderId}",
  region: REGION
}, async (event) => {
  const order = event.data.data();
  const itemSummary = order.items.map((item) => `${item.name} x ${item.quantity}`).join(", ");
  await enqueueMail(
    `${event.params.orderId}_created`,
    order.customer.email,
    "Your DermaCare order was received",
    `<h2>Order received</h2><p>Your order is awaiting payment setup. No payment has been taken.</p><p>${escapeHtml(itemSummary)}</p><p>Total: LKR ${Number(order.total).toLocaleString("en-LK")}</p><p>Order reference: ${escapeHtml(event.params.orderId)}</p>`
  );
});

exports.sendAppointmentReminders = onSchedule({
  schedule: "every 60 minutes",
  timeZone: CLINIC_TIME_ZONE,
  region: REGION
}, async () => {
  const today = getClinicDateKey(new Date());
  const [year, month, day] = today.split("-").map(Number);
  const tomorrow = new Date(Date.UTC(year, month - 1, day + 1)).toISOString().slice(0, 10);
  const appointments = await db.collection("appointments")
    .where("status", "==", "confirmed")
    .where("date", ">=", today)
    .where("date", "<=", tomorrow)
    .limit(500)
    .get();
  const now = new Date();
  const nowParts = datePartsInClinicTime(now);
  const nowMinutes = Number(nowParts.hour) * 60 + Number(nowParts.minute);

  for (const document of appointments.docs) {
    const appointment = document.data();
    if (appointment.reminderSentAt) continue;

    const [year, month, day] = appointment.date.split("-").map(Number);
    const appointmentMinutes = timeToMinutes(appointment.time);
    const dateDelta = Math.round(
      (Date.UTC(year, month - 1, day) - Date.UTC(Number(nowParts.year), Number(nowParts.month) - 1, Number(nowParts.day))) / 86400000
    );
    const minutesUntilAppointment = dateDelta * 1440 + appointmentMinutes - nowMinutes;
    if (minutesUntilAppointment < 23 * 60 || minutesUntilAppointment > 24 * 60) continue;

    const reminderRef = db.collection("appointments").doc(document.id);
    const mailRef = db.collection(MAIL_COLLECTION).doc(`${document.id}_reminder`);
    await db.runTransaction(async (transaction) => {
      const [fresh, queuedMail] = await Promise.all([
        transaction.get(reminderRef),
        transaction.get(mailRef)
      ]);
      if (!fresh.exists || fresh.data().reminderSentAt || fresh.data().status !== "confirmed" || queuedMail.exists) return false;
      transaction.update(reminderRef, { reminderSentAt: FieldValue.serverTimestamp() });
      transaction.create(mailRef, {
        to: [appointment.email],
        message: {
          subject: "Appointment reminder",
          html: appointmentEmail(appointment, "Appointment reminder", "Your appointment is tomorrow", "This is a reminder for your confirmed appointment.")
        },
        createdAt: FieldValue.serverTimestamp()
      });
      return true;
    });
  }
});
