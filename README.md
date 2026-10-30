# DermoCare Slot Reservation System

DermoCare is a responsive static website for a dermatology and aesthetic skincare clinic. It helps visitors explore treatments, view skincare products, create a local demo account, select an appointment slot, and review a demo shopping cart and checkout flow.

The project is implemented with HTML, CSS, and vanilla JavaScript. It does not currently use a backend, database, payment gateway, or real clinic booking API.

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
- Contact page with clinic information and contact form
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
  appointment.html?treatment=CO2%20Laser
  ```

The current appointment flow is a demonstration. It validates the form and prepares a booking request in the browser console, but it does not save or send an appointment to the clinic.

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
| `index.html` | Redirects visitors to the homepage |
| `home.html` | Main clinic homepage |
| `treatment.html` | Treatment catalogue and booking prompts |
| `treatment-detail.html` | Dynamic treatment detail page |
| `CO2.html` | CO2 Laser treatment information |
| `carbonLaser.html` | Carbon Laser Peel information |
| `pigmentation.html` | Pigmentation treatment information |
| `products.html` | Skincare product catalogue and cart |
| `payment.html` | Demo checkout/payment page |
| `appointment.html` | Appointment selection and patient information |
| `contact.html` | Clinic contact and enquiry page |
| `login.html` | Demo login page |
| `signup.html` | Demo account creation page |
| `register.html` | Redirects to the signup page |
| `profile.html` | Current user's demo profile and logout page |

## Project structure

```text
.
├── Images/                  # Treatment and product images
├── index.html               # Entry redirect
├── home.html                # Homepage
├── treatment.html           # Treatment catalogue
├── treatment-detail.html   # Dynamic treatment details
├── appointment.html         # Slot reservation page
├── products.html            # Product catalogue and cart
├── payment.html             # Demo checkout page
├── contact.html             # Contact page
├── login.html               # Login page
├── signup.html              # Signup page
├── profile.html             # Profile page
├── auth.js                  # Signup, login, session, and logout logic
├── theme.js                 # Theme toggle and theme persistence
├── appointment.js           # Appointment calendar, slots, and validation
├── products.js              # Product search and cart logic
├── treatment.js              # Treatment page form behavior
├── treatment-detail.js      # Dynamic treatment details
├── home.css                 # Homepage styles
├── appointment.css          # Appointment page styles
├── auth.css                 # Login, signup, and profile styles
├── products.css             # Product page styles
├── treatment.css            # Treatment catalogue styles
├── treatment-detail.css     # Treatment detail styles
├── contact.css              # Contact page styles
├── theme.css                # Shared theme and profile icon styles
├── pigmentation.css         # Shared treatment detail styling
├── CO2.css                 # CO2 page styles
├── carbonLaser.css         # Carbon Laser page styles
└── appoinment.js            # Legacy appointment script retained in the project
```

## Running the project

No package installation or build step is required.

### Option 1: Open directly

Open `index.html` in a browser. For the most reliable behavior, especially when testing browser storage and linked pages, use a local HTTP server instead.

### Option 2: Start a local server

From the project directory, run one of the following commands:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

If Python is not installed, use any static file server that serves the project root.

## Demo usage flow

1. Open the homepage.
2. Select **Log in** or the profile icon.
3. Select **Create an account** and submit a name, email, and password.
4. Log in using the saved demo account.
5. Open the profile icon to view the profile and test logout.
6. Select a treatment and open **Book Appointment**.
7. Choose a date and time, complete the patient form, and submit the demo request.
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
| `dermacare-users` | `auth.js` | Stores demo signup accounts |
| `dermacare-session` | `auth.js` | Stores the current logged-in user's name and email |
| `dermacare-cart` | `products.js` | Stores the demo cart |
| `dermacare-theme` | `theme.js` | Stores the selected light/dark theme |

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- CSS custom properties
- Responsive layouts and media queries
- Browser `localStorage`
- Google Fonts:
  - DM Serif Display
  - Manrope
- Font Awesome 6 for interface icons
- Local JPG and PNG assets

## Development notes

- Keep all relative links and asset paths aligned with the current project root.
- Use a local HTTP server when testing navigation and browser storage.
- The project contains multiple page-specific stylesheets as well as shared styles in `theme.css`.
- Client-side validation improves the demo experience but is not a security boundary.
- Before production deployment, replace demo authentication, appointment submission, and payment behavior with server-backed implementations.

## Design and prototype

[Figma design and prototype](https://www.figma.com/design/6i4eGtLwbts7AiMRKLVAQA/Dermocare-Web-App?node-id=0-1&t=UtStZuBPz6vXS7r6-1)

## Production roadmap

The following work is required before using this as a real clinic system:

1. Add a backend API and database for users, appointments, products, and orders.
2. Hash passwords with a modern password-hashing algorithm such as Argon2id or bcrypt.
3. Replace `localStorage` authentication with secure, server-managed sessions.
4. Add server-side authorization and input validation.
5. Connect appointment availability to real clinic schedules.
6. Prevent double booking with transactional server-side checks.
7. Integrate a compliant payment provider instead of collecting payment details in the frontend.
8. Add email/SMS confirmations and clinic-side appointment management.
9. Add automated tests, accessibility checks, monitoring, and deployment configuration.
