const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const nodemailer = require("nodemailer");

const publicRoot = path.resolve(__dirname, "..");
loadEnvFile();

const port = Number(process.env.PORT || 8000);
const allowedMethods = new Set(["GET", "HEAD"]);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png"
};

function loadEnvFile() {
  const envPath = path.join(publicRoot, ".env");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(body));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 10000) {
        reject(new Error("Request body is too large."));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error("Request body must be valid JSON."));
      }
    });
    request.on("error", reject);
  });
}

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function validateAppointment(data) {
  const appointment = {
    patientName: clean(data.patientName, 100),
    email: clean(data.email, 254).toLowerCase(),
    phone: clean(data.phone, 30),
    treatment: clean(data.treatment, 100),
    date: clean(data.date, 10),
    time: clean(data.time, 20),
    notes: clean(data.notes, 1000),
    estimatedCost: Number(data.estimatedCost)
  };

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(appointment.email);
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(appointment.date);
  if (
    !appointment.patientName ||
    !validEmail ||
    !appointment.phone ||
    !appointment.treatment ||
    !validDate ||
    !appointment.time ||
    !Number.isFinite(appointment.estimatedCost) ||
    appointment.estimatedCost < 0
  ) {
    return null;
  }

  return appointment;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[character]));
}

function createTransporter() {
  const required = ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "MAIL_FROM"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing email configuration: ${missing.join(", ")}`);
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
}

async function sendAppointmentEmail(appointment) {
  const transporter = createTransporter();
  const safe = Object.fromEntries(
    Object.entries(appointment).map(([key, value]) => [key, escapeHtml(value)])
  );

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: appointment.email,
    subject: `DermaCare appointment request - ${appointment.date}`,
    text: [
      `Hello ${appointment.patientName},`,
      "",
      "We received your DermaCare appointment request.",
      `Treatment: ${appointment.treatment}`,
      `Date: ${appointment.date}`,
      `Time: ${appointment.time}`,
      `Estimated cost: LKR ${appointment.estimatedCost.toLocaleString("en-LK")}`,
      "",
      "The clinic will contact you to confirm availability."
    ].join("\n"),
    html: `
      <h2>DermaCare appointment request received</h2>
      <p>Hello ${safe.patientName},</p>
      <p>We received your appointment request. The clinic will contact you to confirm availability.</p>
      <ul>
        <li><strong>Treatment:</strong> ${safe.treatment}</li>
        <li><strong>Date:</strong> ${safe.date}</li>
        <li><strong>Time:</strong> ${safe.time}</li>
        <li><strong>Estimated cost:</strong> LKR ${appointment.estimatedCost.toLocaleString("en-LK")}</li>
      </ul>
    `
  });
}

async function handleAppointment(request, response) {
  try {
    const data = await readJson(request);
    const appointment = validateAppointment(data);
    if (!appointment) {
      sendJson(response, 400, { message: "Please provide valid appointment details." });
      return;
    }

    let message = "Appointment request received. The clinic will contact you to confirm availability.";

    try {
      await sendAppointmentEmail(appointment);
      message = "Appointment request received. A confirmation email was sent.";
    } catch (error) {
      console.error("Appointment saved without confirmation email:", error);
    }

    sendJson(response, 201, { message });
  } catch (error) {
    console.error("Unable to send appointment email:", error);
    sendJson(response, 500, { message: "We could not send the appointment email. Please try again later." });
  }
}

function serveStatic(request, response) {
  if (!allowedMethods.has(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }

  const requestedPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
  const relativePath = requestedPath === "/" ? "HTML/index.html" : requestedPath.slice(1);
  const filePath = path.resolve(publicRoot, relativePath);
  if (!filePath.startsWith(`${publicRoot}${path.sep}`) || !fs.existsSync(filePath)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  response.writeHead(200, {
    "Content-Type": contentTypes[extension] || "application/octet-stream"
  });
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer((request, response) => {
  if (request.method === "OPTIONS" && request.url === "/api/appointments") {
    response.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS"
    });
    response.end();
    return;
  }

  if (request.method === "POST" && request.url === "/api/appointments") {
    handleAppointment(request, response);
    return;
  }
  serveStatic(request, response);
});

server.listen(port, () => {
  console.log(`DermaCare is running at http://localhost:${port}`);
});
