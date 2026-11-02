# DermoCare Slot Reservation System

DermoCare is a responsive website for a dermatology and aesthetic skincare clinic. It helps visitors explore treatments, create Firebase accounts, book appointments, and place product orders.

The client uses HTML, CSS, vanilla JavaScript, and Firebase. Cloud Functions enforce appointment reservations, admin actions, and server-calculated product orders. Payment processing is not connected.

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

- Firebase Authentication signup and login with email and password
- Account display name stored in the Firebase Authentication profile
- Firebase-managed login session
- Profile page showing the authenticated user's name and email
- Logout action that ends the Firebase session
- Profile icon in the navigation bars linking to the profile page

Enable the **Email/Password** provider in Firebase Console under **Authentication → Sign-in method** before using signup or login. Authentication errors are shown on the relevant page.

### Appointment booking

- Treatment selection with treatment-specific price and duration
- Treatment search
- Interactive calendar
- Previous and next month controls
- Past dates and closed weekdays disabled
- Live Firestore availability, with booked slots disabled
- Patient information form
- Appointment summary with treatment, date, time, duration, and cost
- Atomic Cloud Function reservations to prevent duplicate bookings
- Clinic confirmation status, email updates, cancellation, and rescheduling
- Customer appointment history in the profile
- Query-string treatment preselection, for example:

  ```text
  appointment.html?treatment=CO2%20Laser
  ```

Appointments require a signed-in email/password account. New requests are pending until clinic staff confirms them. The default schedule is Monday–Saturday, 9:00 AM–6:30 PM, with Sunday closed; an administrator can edit weekly slots.

### Products and checkout

- Product catalogue using local product images
- Product search/filtering
- Shopping cart persisted in Firestore for signed-in customers (with a local browser copy)
- Quantity updates and item removal
- Firestore orders with prices recalculated on the server
- Customer order history in the profile
- Email order receipts and appointment reminders

Orders are created with `awaiting_payment` status. **No payment is taken**; the checkout page does not collect card details. A payment provider must be integrated before taking payments.

### Clinic administration

- Admin dashboard to review, confirm, and cancel appointment requests
- Weekly clinic hours and bookable slots management
- Admin access is protected by Firebase custom claims, not a client-side role field

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
| `payment.html` | Firestore order checkout (no payment processing) |
| `appointment.html` | Appointment selection and patient information |
| `contact.html` | Clinic contact and enquiry page |
| `login.html` | Firebase login page |
| `signup.html` | Firebase account creation page |
| `register.html` | Redirects to the signup page |
| `profile.html` | Customer profile, appointment history, order history, and logout |
| `admin.html` | Custom-claim protected clinic dashboard |
| `functions/index.js` | Secure booking, order, admin, email, and reminder functions |
| `firestore.rules` | Customer/admin data access rules |

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
├── payment.html             # Firestore order checkout (no payment processing)
├── contact.html             # Contact page
├── login.html               # Login page
├── signup.html              # Signup page
├── profile.html             # Profile, booking history, order history
├── admin.html               # Clinic admin dashboard
├── auth.js                  # Signup, login, session, and logout logic
├── theme.js                 # Theme toggle and theme persistence
├── appointment.js           # Live appointment availability and booking
├── account.js               # Customer booking/order history and actions
├── products.js              # Product search and cart logic
├── order.js                 # Firestore order checkout
├── firestore.rules          # Firestore access control
├── firebase.json            # Firebase deployment configuration
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
├── appoinment.js            # Legacy appointment script retained in the project
└── functions/               # Cloud Functions and admin claim helper
```

## Running the project

The static website needs no build step. Install Firebase Functions dependencies as described in [Firebase deployment setup](#firebase-deployment-setup).

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
4. Log in using the Firebase account.
5. Open the profile icon to view the profile and test logout.
6. Select a treatment and open **Book Appointment**.
7. Choose an available date and time, complete the patient form, and submit the appointment request.
8. Open **Products**, add items to the cart, and place an order. No payment is collected.

To reset demo data, open the browser developer console and run:

```javascript
localStorage.removeItem("dermacare-cart");
localStorage.removeItem("dermacare-cart-owner");
localStorage.removeItem("dermacare-theme");
```

Accounts previously stored in browser `localStorage` are not migrated to Firebase; users need to create a new account.

## Browser storage keys

| Key | Used by | Purpose |
| --- | --- | --- |
| `dermacare-cart` | `products.js` | Local copy of the cart (signed-in carts are also stored in Firestore) |
| `dermacare-cart-owner` | `products.js` | Firebase UID that owns the browser cart cache |
| `dermacare-theme` | `theme.js` | Stores the selected light/dark theme |

## Technology

- HTML5
- CSS3
- Vanilla JavaScript
- CSS custom properties
- Responsive layouts and media queries
- Browser `localStorage` (theme and a cart cache)
- Firebase Authentication (email/password)
- Cloud Firestore
- Firebase Cloud Functions
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
- Email is sent through the Firebase Trigger Email extension; reminders use a scheduled Cloud Function.

## Firebase deployment setup

These features only work after the Firebase backend is configured and deployed.

1. In Firebase Console, enable **Authentication → Email/Password** and confirm Firestore is created for project `dermocare-9a089`.
2. Install the Firebase CLI, sign in with a project administrator, and enable billing for Cloud Functions and scheduled reminders.
3. From the project root, install Functions dependencies and deploy rules, indexes, and functions:

   ```powershell
   cd functions
   npm install
   cd ..
   firebase deploy --only firestore:rules,firestore:indexes,functions
   ```

4. Install the **Trigger Email from Firestore** Firebase Extension. Configure its collection as `mail` and provide an SMTP service and verified sender address. Configure credentials only in the Firebase Extension settings; never commit them.
5. Grant the clinic administrator role to a trusted Firebase Authentication user. Authenticate Google Application Default Credentials as a project administrator, then run from the `functions` folder:

   ```powershell
   npm run set-admin -- grant FIREBASE_USER_UID
   ```

   To remove access, use `revoke` instead of `grant`. The administrator must sign out and back in after a claim change.
6. Open `admin.html` with the clinic's administrator account. Confirm the weekly schedule before accepting bookings.

The hourly reminder function requires Cloud Scheduler, which may incur Google Cloud charges. Test email delivery, booking/cancellation/rescheduling, admin claims, Firestore rules, and reminder timing in a non-production Firebase project before launch.

## Design and prototype

[Figma design and prototype](https://www.figma.com/design/6i4eGtLwbts7AiMRKLVAQA/Dermocare-Web-App?node-id=0-1&t=UtStZuBPz6vXS7r6-1)

## Production roadmap

Before production use:

1. Integrate a payment provider using its hosted/secure checkout; do not collect card numbers in this frontend.
2. Add inventory, shipping, refunds, and order fulfillment management.
3. Add automated tests, accessibility checks, monitoring, and production deployment configuration.
