# DermoCare Slot Reservation System

DermoCare is a responsive static website for a dermatology and aesthetic skincare clinic. It helps visitors explore treatments, view skincare products, create a local demo account, select an appointment slot, and review a demo shopping cart and checkout flow.

The project is implemented with HTML, CSS, vanilla JavaScript, and a small Node.js API. It does not use a database or payment gateway. The appointment API sends confirmation emails through the configured SMTP provider.

## Features

### Public website

- Responsive homepage with:
  - Clinic introduction and hero section
  - Treatment highlights
  - Clinic statistics and trust indicators
  - Product and appointment calls to action
- Treatment catalogue and treatment detail pages
- Dedicated information pages for:
  - CO2 Laser
  - Carbon Laser Peel
  - Pigmentation care
  - Laser Hair Removal
  - RF Microneedling
  - PRP Therapy
  - Chemical Peeling
  - Botox and fillers
- Contact page with clinic information, opening hours, map, social links, and a client-side enquiry form
- Responsive navigation bars with links to treatments, products, contact, appointments, login, and profile
- Light and dark theme toggle. The selected theme is saved in browser storage.

### Authentication and profile

- Signup form for creating a demo account
- Login form with email and password validation
- Duplicate email detection during signup
- Login session saved in `localStorage`
- Profile page showing the logged-in user's name and email
- Logout action that clears the current session
- Profile icon in the navigation bars linking to the profile page

> **Important:** This is frontend-only demo authentication. Passwords are stored in browser `localStorage` and are not suitable for production use. A real application must use a secure backend, password hashing, HTTPS, session management, and server-side validation.

### Appointment booking

- Treatment selection with treatment-specific price and duration
- Treatment search
- Interactive calendar
- Previous and next month controls
- Past dates and Sundays disabled
- Available time slots grouped by morning, afternoon, and evening
- Patient information form
- Appointment summary with treatment, date, time, duration, and cost
- Query-string treatment preselection, for example:

  ```text
  HTML/appointment.html?treatment=CO2%20Laser
  ```

The appointment flow validates the form and sends the request to `POST /api/appointments`. The API sends a confirmation email to the email address entered in the appointment form. The clinic still needs to confirm availability separately.

### Products and checkout

- Product catalogue using local product images
- Product search/filtering
- Demo shopping cart
- Quantity updates and item removal
- Cart state saved in `localStorage`
- Demo checkout/payment page

The checkout page is a frontend demonstration only. It does not process real payments or create an order in a backend system.

## Pages

| Page | Purpose |
| --- | --- |
| `HTML/index.html` | Redirects visitors to the homepage |
| `HTML/home.html` | Main clinic homepage |
| `HTML/treatment.html` | Treatment catalogue and booking prompts |
| `HTML/treatment-detail.html` | Dynamic treatment detail page |
| `HTML/CO2.html` | CO2 Laser treatment information |
| `HTML/carbonLaser.html` | Carbon Laser Peel information |
| `HTML/pigmentation.html` | Pigmentation treatment information |
| `HTML/products.html` | Skincare product catalogue and cart |
| `HTML/payment.html` | Demo checkout/payment page |
| `HTML/appointment.html` | Appointment selection and patient information |
| `HTML/contact.html` | Clinic contact details, map, and demo enquiry form |
| `HTML/login.html` | Demo login page |
| `HTML/signup.html` | Demo account creation page |
| `HTML/register.html` | Redirects to the signup page |
| `HTML/profile.html` | Current user's demo profile and logout page |

## Project structure

```text
.
├── Images/                  # Treatment and product images
├── HTML/                    # Website pages
├── CSS/                     # Page and shared stylesheets
├── JS/                      # Browser scripts and Node.js API server
├── package.json             # Node.js scripts and dependencies
├── package-lock.json        # Locked npm dependency versions
├── .env.example             # SMTP configuration template
├── .gitignore               # Local secrets and dependency exclusions
└── README.md
```

## Running the project

The static pages do not need a build step. The application server requires Node.js and one package installation.

### Option 1: Open directly

Open `HTML/index.html` in a browser. For the most reliable behavior, especially when testing browser storage and linked pages, use a local HTTP server instead.

### Option 2: Start the application server

Install the email dependency and copy `.env.example` to `.env`. Fill in the SMTP values before starting the server:

```powershell
npm install
Copy-Item .env.example .env
npm start
```

Never commit `.env`; it contains the SMTP password.

The application server exposes:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/appointments` | Validates appointment details and emails a confirmation to the patient |

Required `.env` values:

```text
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASSWORD=your-smtp-password
MAIL_FROM=DermaCare <appointments@example.com>
PORT=8000
```

Use the application server, rather than `python -m http.server`, when testing appointment email delivery.

### Option 3: Start a static local server (frontend only)

From the project directory, run one of the following commands:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/HTML/index.html
```

If Python is not installed, use any static file server that serves the project root.

## Demo usage flow

1. Open the homepage.
2. Select **Log in** or the profile icon.
3. Select **Create an account** and submit a name, email, and password.
4. Log in using the saved demo account.
5. Open the profile icon to view the profile and test logout.
6. Select a treatment and open **Book Appointment**.
7. Choose a date and time, complete the patient form, and submit the appointment request.
8. Open **Products**, add items to the cart, and continue to the demo checkout page.

To reset demo data, open the browser developer console and run:

```javascript
localStorage.removeItem("dermacare-users");
localStorage.removeItem("dermacare-session");
localStorage.removeItem("dermacare-cart");
localStorage.removeItem("dermacare-theme");
```

## Browser storage keys

| Key | Used by | Purpose |
| --- | --- | --- |
| `dermacare-users` | `JS/auth.js` | Stores demo signup accounts |
| `dermacare-session` | `JS/auth.js` | Stores the current logged-in user's name and email |
| `dermacare-cart` | `JS/products.js` | Stores the demo cart |
| `dermacare-theme` | `JS/theme.js` | Stores the selected light/dark theme |

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- Node.js HTTP server
- Nodemailer SMTP integration
- CSS custom properties
- Responsive layouts and media queries
- Browser `localStorage`
- Google Fonts:
  - DM Serif Display
  - Manrope
- Font Awesome 6 for interface icons
- Local JPG and PNG assets

## Development notes

- Keep page files in `HTML/`, stylesheets in `CSS/`, browser scripts in `JS/`, and media in `Images/`.
- HTML pages use `../CSS/`, `../JS/`, and `../Images/` for local assets.
- Use a local HTTP server when testing navigation and browser storage.
- The project contains multiple page-specific stylesheets as well as shared styles in `theme.css`.
- The contact form is a frontend demo: it validates required fields and displays a success message but does not send data to the server.
- Client-side validation improves the demo experience but is not a security boundary.
- Before production deployment, replace demo authentication with server-backed authentication and protect the appointment API with rate limiting, authentication where required, and persistent booking storage.

## Design and prototype

[Figma design and prototype](https://www.figma.com/design/6i4eGtLwbts7AiMRKLVAQA/Dermocare-Web-App?node-id=0-1&t=UtStZuBPz6vXS7r6-1)

## Production roadmap

The following work is required before using this as a real clinic system:

1. Add a database for users, appointments, products, and orders, and persist requests received by the appointment API.
2. Hash passwords with a modern password-hashing algorithm such as Argon2id or bcrypt.
3. Replace `localStorage` authentication with secure, server-managed sessions.
4. Add server-side authorization and input validation.
5. Connect appointment availability to real clinic schedules.
6. Prevent double booking with transactional server-side checks.
7. Integrate a compliant payment provider instead of collecting payment details in the frontend.
8. Add clinic-side appointment management and improve email/SMS delivery tracking.
9. Add automated tests, accessibility checks, monitoring, and deployment configuration.
