# DermoCare Slot Reservation System

DermoCare is a responsive website for a dermatology and aesthetic skincare clinic. Visitors can explore treatments, browse products, create an account, and submit appointment requests.

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

### Authentication and profile

- Signup and login with Firebase Authentication
- Password reset email through Firebase Authentication
- User profiles stored in Firestore
- Profile page and logout flow

### Appointments and orders

- Appointment requests and product orders are stored in Firestore
- Appointment confirmation emails are sent by the Node.js API when SMTP is configured
- Customers must be signed in to book appointments or place orders
- Firestore rules restrict customer records to their owner and dashboard access to the verified administrator account

### Appointment booking

- Treatment search and selection
- Interactive date picker and slot selection
- Appointment summary and patient details form
- Submission to `POST /api/appointments`
- Confirmation email sent by the Node.js API when SMTP credentials are configured
- Appointment requests are still accepted when SMTP is not configured
- New bookings appear in the admin dashboard

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
| `HTML/cart.html` | Shopping cart |
| `HTML/checkout.html` | Order checkout |
| `HTML/payment.html` | Demo checkout page |
| `HTML/contact.html` | Contact and enquiry page |
| `HTML/login.html` | Customer login page |
| `HTML/signup.html` | Customer signup page |
| `HTML/register.html` | Redirect page to signup |
| `HTML/profile.html` | Customer profile page |
| `HTML/admin-login.html` | Admin login |
| `HTML/admin.html` | Admin dashboard for appointments and product orders |

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
├── firestore.rules          # Firestore access rules
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

### Firebase setup

1. In Firebase Console, enable **Authentication → Email/Password**.
2. Create a **Cloud Firestore** database.
3. Publish `firestore.rules` under **Firestore Database → Rules**.
4. Create `admin@dermacare.lk` in Firebase Authentication. Use the admin login page once to receive a verification email, verify it, then sign in again.
5. Add the domain used to run the website under **Authentication → Settings → Authorized domains**.
6. Open `HTML/firebase-test.html` while signed in to verify Auth and Firestore.

The Firebase web config is in `JS/firebase.js`. Existing accounts and appointments saved in browser `localStorage` are not copied automatically to Firebase.

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
| `dermacare-cart` | `JS/products.js` | Stores demo cart items |
| `dermacare-cart-v1` | `JS/cart.js`, `JS/checkout.js` | Stores the current product cart |
| `dermacare-theme` | `JS/theme.js` | Stores selected light/dark theme |

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Node.js
- Nodemailer
- Firebase Authentication
- Cloud Firestore
- Browser `localStorage` for cart and theme preferences

## Design prototype

[Figma design and prototype](https://www.figma.com/design/6i4eGtLwbts7AiMRKLVAQA/Dermocare-Web-App?node-id=0-1&t=UtStZuBPz6vXS7r6-1)
