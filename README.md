# DermoCare Slot Reservation System

DermoCare is a responsive static website for a dermatology and aesthetic skincare clinic. Visitors can explore treatments, browse products, create a demo account, and submit appointment requests.

The repository contains:

- A static frontend under `HTML/`, `CSS/`, and `JS/`
- A small Node.js API (`JS/server.js`) used to accept appointment requests and send confirmation emails via SMTP

## Features

### Public website

- Responsive homepage with treatment and product call-to-actions
- Treatment catalogue and treatment detail pages
- Contact page with clinic details, map, social links, and a client-side enquiry form
- Product catalogue with search and demo cart
- Light/dark theme toggle persisted in browser storage

### Demo authentication and profile

- Signup and login with client-side validation
- Duplicate email detection during signup
- Session persistence in browser `localStorage`
- Profile page and logout flow

> Demo authentication is frontend-only and not production-safe.

### Appointment booking

- Treatment search and selection
- Interactive date picker and slot selection
- Appointment summary and patient details form
- Submission to `POST /api/appointments`
- Confirmation email sent by the Node.js API through configured SMTP credentials

## Pages

| Page | Purpose |
| --- | --- |
| `HTML/index.html` | Redirects visitors to the homepage |
| `HTML/home.html` | Main homepage |
| `HTML/treatment.html` | Treatment catalogue |
| `HTML/treatment-detail.html` | Dynamic treatment detail page |
| `HTML/CO2.html` | CO2 Laser treatment page |
| `HTML/carbonLaser.html` | Carbon Laser Peel page |
| `HTML/pigmentation.html` | Pigmentation treatment page |
| `HTML/appointment.html` | Appointment booking page |
| `HTML/products.html` | Product catalogue and cart |
| `HTML/payment.html` | Demo checkout page |
| `HTML/contact.html` | Contact and enquiry page |
| `HTML/login.html` | Demo login page |
| `HTML/signup.html` | Demo signup page |
| `HTML/register.html` | Redirect page to signup |
| `HTML/profile.html` | Demo profile page |

## Project structure

```text
.
├── HTML/                    # Website pages
├── CSS/                     # Stylesheets
├── JS/                      # Browser scripts and Node.js API server
├── Images/                  # Treatment and product media assets
├── package.json             # Node.js scripts and dependencies
├── package-lock.json        # Locked npm dependency versions
├── .env.example             # SMTP configuration template
└── README.md
```

## Running the project

### Option 1: Run with the Node.js server (recommended for appointment email flow)

```bash
npm install
cp .env.example .env
npm start
```

Then open: `http://localhost:8000/HTML/index.html`

Required `.env` variables:

```text
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
MAIL_FROM=DermoCare <appointments@example.com>
PORT=8000
```

### Option 2: Static frontend-only run

```bash
python -m http.server 8000
```

Then open: `http://localhost:8000/HTML/index.html`

> Do not commit `.env` because it contains SMTP credentials.

## Browser storage keys

| Key | Used by | Purpose |
| --- | --- | --- |
| `dermacare-users` | `JS/auth.js` | Stores demo signup accounts |
| `dermacare-session` | `JS/auth.js` | Stores current logged-in user details |
| `dermacare-cart` | `JS/products.js` | Stores demo cart items |
| `dermacare-theme` | `JS/theme.js` | Stores selected light/dark theme |

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Node.js
- Nodemailer
- Browser `localStorage`

## Design prototype

[Figma design and prototype](https://www.figma.com/design/6i4eGtLwbts7AiMRKLVAQA/Dermocare-Web-App?node-id=0-1&t=UtStZuBPz6vXS7r6-1)
