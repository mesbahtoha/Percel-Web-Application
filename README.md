# ⚡ ZapShift — Parcel Delivery Application

> A production-ready, full-stack parcel delivery management platform connecting **Users**, **Riders**, and **Admins** through a centralized, real-time logistics system — with role-based access, live dashboards, charts, dark mode, and Google login.

![ZapShift Banner](https://img.shields.io/badge/ZapShift-Parcel%20Delivery-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-7-purple?style=flat-square&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?style=flat-square&logo=mongodb)
![Firebase](https://img.shields.io/badge/Firebase-Auth-yellow?style=flat-square&logo=firebase)

---

## 🔗 Live Demo & Repository

- 🌐 **Frontend (Live):** [https://percel-web-application-hlmu.vercel.app/](https://percel-web-application-hlmu.vercel.app/)
- ⚙️ **Backend API (Live):** [https://percel-web-application.vercel.app/](https://percel-web-application.vercel.app/)
- 💻 **GitHub Repo:** [github.com/mesbahtoha/Percel-Web-Application](https://github.com/mesbahtoha/Percel-Web-Application) (Client + Server in one monorepo)

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| 👑 **Admin** | `admin@gmail.com` | `admin123` |
| 👤 **User (Demo)** | `user@gmail.com` | `user123` |

> Both demo accounts are created by the seed script (Firebase Auth + MongoDB) — see [Seeding](#-seeding-admin--demo-accounts). You can also use the **Admin Demo / User Demo** one-click buttons on the login page.

### Admin Routes

The admin dashboard lives under the **`/admin`** base path (role-based — only users with `role: admin` can access it).

| Route | Description |
|---|---|
| `/admin` | Admin Overview (dashboard) |
| `/admin/overview` | Overview (same as dashboard) |
| `/admin/manage-user` | Manage users |
| `/admin/manage-user/:id` | User details |
| `/admin/orders` | All orders |
| `/admin/orders/:id` | Order details |
| `/admin/parcel-tracking` | Parcel tracking |
| `/admin/payment-receive` | Payments received |
| `/admin/manage-rider` | Manage riders |
| `/admin/manage-rider/:id` | Rider details |
| `/admin/rider-assign` | Assign riders to parcels |
| `/admin/rider-payment` | Rider payments |
| `/admin/rider-task-update` | Rider task updates |
| `/admin/notifications` | Admin notifications |

---

## 📌 Project Overview

**ZapShift** is a modern, full-stack parcel delivery web application. Users book parcels, riders manage deliveries, and admins oversee the entire operation with real-time insights and charts.

The platform supports **three distinct user roles**, each with a dedicated dashboard:

| Role | Dashboard | Key Responsibilities |
|------|-----------|----------------------|
| 👤 **User** | `/dashboard/*` | Book parcels, pay charges, track status, payment history |
| 🏍️ **Rider** | `/dashboard/rider/*` | Collect & deliver parcels, update statuses, earnings |
| 👑 **Admin** | `/admin/*` | Overview, manage users/riders/orders, assign riders, payments |

---

## ✨ Key Features (Requirements Checklist)

### Global UI & Design
- ✅ Maximum 3 primary colors (lime/teal palette) + neutral colors
- ✅ **Light & Dark mode** toggle (navbar button, persisted in `localStorage`, no flash on load)
- ✅ Consistent card sizes, border radius, spacing, and layout everywhere
- ✅ Forms with client-side validation, error/success messages, loading spinners
- ✅ Fully responsive (mobile, tablet, desktop)

### Landing Page (Home)
- ✅ Sticky navbar with dropdown (profile menu), 5+ routes logged out / 6+ logged in
- ✅ Hero section (~65vh) with slider/animations and clear CTA flow
- ✅ **9 sections**: Banner, Services, Statistics (animated counters), Logos, Features, Testimonials, FAQ, Be a Merchant, Call to Action
- ✅ Full footer with working links, contact info, and social links

### Core Listing / Cards
- ✅ Uniform cards (same height/width/radius), 3+ per row on desktop
- ✅ Each card has image, title, description, meta info, and "View Details" button (service center cards, parcel cards)
- ✅ Skeleton/loading states while fetching data

### Details & Listing Pages
- ✅ Public details pages (About, Contact, Coverage)
- ✅ **Coverage / Explore page** — search bar + district filtering + map
- ✅ **Send Parcel page** — service center search, category & price filters

### Authentication
- ✅ Login & Registration with validation
- ✅ **Demo login buttons** (Admin Demo / User Demo auto-fill + submit)
- ✅ **Google social login** (Login + Register)
- ✅ Forgot password (Firebase password reset email)
- ✅ Role-based redirect after login (Admin → `/admin`, Rider → `/dashboard/rider/overview`, User → `/dashboard/overview`)

### Dashboard (Role-Based)
- ✅ **User dashboard**: Overview, My Parcels, Add Parcel, Track Parcel, Payment History, Profile, Settings
- ✅ **Admin dashboard** (`/admin`): Overview (+ **Bar, Line, Donut charts** with real dynamic data), Manage Users, Orders, Parcel Tracking, Payments, Manage Riders, Assign Rider, Rider Payments, Rider Task Updates, Notifications
- ✅ **Rider dashboard**: Overview, Tasks, Earnings, Profile, Notifications
- ✅ Profile icon with dropdown menu in all dashboard navbars (Profile, Logout, admin shortcut)
- ✅ Data tables with search/filter + pagination
- ✅ Profile page with editable user info

### Additional Pages
- ✅ About, Contact (with validated form + email delivery), Coverage, Be a Rider

### Backend
- ✅ Express + MongoDB (official driver) with modular structure (`routes/`, `controllers/`, `middlewares/`, `config/`, `services/`, `utils/`)
- ✅ Centralized error handling + proper status codes
- ✅ Firebase Auth (JWT ID tokens) + **server-side role enforcement** (client can no longer self-assign admin)
- ✅ CORS allowlist, input validation, RBAC middleware (`verifyFBToken`, `verifyAdmin`, `verifyRiderOrAdmin`)

---

## 🚀 Delivery Flow

```
User Books Parcel (Unpaid)
        ↓
User Pays (Stripe) → Status: Paid
        ↓
Admin Assigns Rider → Status: Assigned
        ↓
Rider Takes Parcel → Status: Taken → Shifted → Out for Delivery
        ↓
Rider Delivers → Status: Completed ✅  (rider earns; admin tracks cash in/out)
```

---

## 🛠️ Tech Stack

### Frontend (`zap-shift-client`)
| Technology | Purpose |
|---|---|
| **React 19 + Vite 7** | Core UI framework & build tool |
| **React Router 7** | Client-side routing & protected routes |
| **Tailwind CSS v4 + DaisyUI 5** | Styling, theming (light/dark) |
| **TanStack Query** | Server state management |
| **React Hook Form** | Form handling & validation |
| **Firebase Auth** | Email/password + Google sign-in |
| **Stripe** | Online payment (card) |
| **React Leaflet** | Bangladesh coverage map |
| **SweetAlert2, AOS, React Icons, Lucide, Marquee** | UX polish |

### Backend (`zap-shift-server`)
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | RESTful API |
| **MongoDB** (official driver) | Data persistence (users, parcels, payments, riderTasks, riderEarnings, notifications, contacts) |
| **Firebase Admin SDK** | Verify ID tokens, seed users |
| **Nodemailer** | OTP & contact emails (Gmail SMTP) |
| **Stripe SDK** | Payment intents |
| **jsonwebtoken** | OTP verification tokens |

---

## 🏗️ Project Structure

```
Percel-Web-Application/
├── zap-shift-client/                     # React Frontend (Vite)
│   ├── public/
│   │   ├── serviceCenter.json            # 64 district service center data (map markers)
│   │   └── delivery-van.png              # Favicon
│   ├── src/
│   │   ├── Admin_Role/                   # Admin dashboard (routes under /admin)
│   │   │   ├── adminLayouts/             # AdminLayout (sidebar + navbar shell)
│   │   │   ├── adminPages/               # Overview (+charts), ManageUsers, Orders,
│   │   │   │                             #   ParcelTracking, Payments, ManageRiders,
│   │   │   │                             #   AssignRider, RiderPayments, Notifications
│   │   │   └── AdminComponents/          # AdminNavbar, AdminSidebar, AdminCharts (SVG)
│   │   ├── RiderRole/                    # Rider dashboard
│   │   ├── api/                          # axios instances (httpClient, authHttpClient)
│   │   ├── context/AuthContext/          # Firebase auth provider
│   │   ├── coverage/                     # Coverage page + Leaflet map
│   │   ├── firebase/                     # Firebase initialization
│   │   ├── hooks/                        # useAuth, useAxios, useTheme, etc.
│   │   ├── layouts/                      # RootLayout, DashboardLayout
│   │   ├── pages/                        # Home, Authentication, Dashboard, SendParcel,
│   │   │                                 #   BeARider, About, Contact, shared (Navbar/Footer)
│   │   ├── router/router.jsx             # All application routes (single source)
│   │   ├── routes/                       # PrivateRoute, PublicRoute, PrivateRouteAdmin
│   │   ├── main.jsx                      # App entry (RouterProvider + providers)
│   │   └── index.css                     # Tailwind v4 + Urbanist font
│   └── package.json
│
└── zap-shift-server/                     # Node.js Backend
    ├── api/index.js                      # Vercel serverless entry
    ├── src/
    │   ├── app.js                        # Express app (CORS, JSON, routes)
    │   ├── server.js                     # Local server entry
    │   ├── config/                       # db, env, firebase, mailer, stripe
    │   ├── controllers/                  # auth, user, parcel, payment, rider*,
    │   │                                 #   notification, admin, contact
    │   ├── middlewares/                  # verifyFBToken, verifyAdmin, errorHandler
    │   ├── routes/                       # API route modules
    │   ├── services/                     # mail, notification, riderTask, stripe
    │   └── utils/                        # ApiError, helpers
    ├── scripts/seed-admin.js             # Seed admin + demo user (Firebase + MongoDB)
    ├── .env.example                      # Env template
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js **v18 or higher**
- MongoDB Atlas account
- Firebase project (Authentication: **Email/Password** + **Google** providers enabled)
- Stripe account
- Gmail account with an App Password (for OTP/contact emails)

### 1. Clone the Repository
```bash
git clone https://github.com/mesbahtoha/Percel-Web-Application.git
cd Percel-Web-Application
```

### 2. Frontend Setup
```bash
cd zap-shift-client
npm install
npm run dev
```

Create `.env` (see `.env.example`):
```env
VITE_API_URL=http://localhost:3000
VITE_apiKey=your_firebase_api_key
VITE_authDomain=your_auth_domain
VITE_projectId=your_project_id
VITE_storageBucket=your_storage_bucket
VITE_messagingSenderId=your_sender_id
VITE_appId=your_app_id
VITE_img_upload_key=your_imgbb_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 3. Backend Setup
```bash
cd zap-shift-server
npm install
npm run dev
```

Create `.env` (see `.env.example`):
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=parcelDB
CLIENT_URL=http://localhost:5173
FB_SERVICE_KEY=base64_of_your_firebase_service_account_json
STRIPE_SECRET_KEY=your_stripe_secret_key
OTP_JWT_SECRET=a_strong_random_secret
EMAIL_SENDER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
TAKA_PER_USD=120
```

### 4. Seeding Admin & Demo Accounts
```bash
cd zap-shift-server
npm run seed:admin
```
This creates (in **both** Firebase Auth and MongoDB):
- `admin@gmail.com` / `admin123` → role `admin`
- `user@gmail.com` / `user123` → role `user`

Custom admin: `npm run seed:admin -- youremail@example.com yourpassword`

---

## ▲ Vercel Deployment (Monorepo)

The frontend and backend live in the **same repository**. Vercel deploys them as **two separate projects** — each points to this repo with a different **Root Directory**.

> ✅ **Currently deployed:**
> - Frontend: https://percel-web-application-hlmu.vercel.app/
> - Backend: https://percel-web-application.vercel.app/

1. **Backend** → Root Directory `zap-shift-server` (serverless via `api/index.js`; set the same env vars as above, including `CLIENT_URL`).
2. **Frontend** → Root Directory `zap-shift-client` (`vercel.json` enables SPA rewrites so deep links like `/admin`, `/about`, `/contact` work on refresh).
3. After deploy: add the frontend domain to **Firebase Authentication → Authorized domains**.
4. Run `npm run seed:admin` against the **production** database (or run it locally pointing at the production MongoDB) so the live admin login works.

> **Note:** The repo is connected to Vercel, so every push to `main` triggers automatic redeploys of both projects.

---

## 💳 Pricing Structure

| Parcel Type | Weight | Within City | Outside City |
|---|---|---|---|
| Document | Any | ৳60 | ৳80 |
| Non-Document | Up to 3kg | ৳110 | ৳150 |
| Non-Document | Above 3kg | +৳40/kg | +৳40/kg (+৳40 extra) |

**Rider Earnings:**
- 80% of delivery charge for same-city deliveries
- 60% for outside city/district deliveries

---

## 🔐 Security Features

- **Firebase ID-token authentication** (JWT) on all protected routes
- **Role-Based Access Control (RBAC)** — `verifyAdmin`, `verifyRiderOrAdmin` middleware; admin routes under `/admin` API are admin-only
- **Server-side role enforcement** — `POST /users` ignores client-supplied roles (no self-privilege escalation)
- **Input validation** on auth, parcel, profile, and contact endpoints
- **CORS allowlist** — only the configured client origins
- **Environment variables** — no secrets committed
- **OTP delivery confirmation** — prevents unauthorized parcel collection

---

## 📦 API Endpoint Overview

| Method | Endpoint | Access |
|---|---|---|
| POST | `/users` | Public (create user, role always `user`) |
| GET | `/users/role/:email` | Public (role check for redirects/guards) |
| PATCH | `/users/profile`, `/users/last-login` | 🔒 Self |
| POST | `/parcels` | 🔒 User |
| GET | `/parcels`, `/parcels/user/:email`, `/parcels/:id` | Public / 🔒 |
| DELETE | `/parcels/:id` | 🔒 Owner |
| POST | `/create-payment-intent`, `/payments` | 🔒 |
| GET | `/payments/:email` | 🔒 Self |
| POST | `/contact` | Public (validated; saves + emails) |
| GET/PATCH | `/rider-accounts/*` | 🔒 |
| GET/PATCH | `/rider-tasks/*`, `/rider-earnings/*` | 🔒 Rider/Admin |
| GET/PATCH | `/admin/*` (19 endpoints) | 🔒 Admin only |
| GET/PATCH | `/rider/notifications/*`, `/user/notifications/*` | 🔒 |

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

1. Fork the project
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Mesbah Toha**
- GitHub: [@mesbahtoha](https://github.com/mesbahtoha)
- LinkedIn: [@mesbahul-alam](https://www.linkedin.com/in/mesbahul-alam/)
- Email: [mesbahulalam017@gmail.com](mesbahulalam017@gmail.com)

---

<p align="center">Made with ❤️ by Md.Mesbahul Alam | ⚡ ZapShift — Delivering Fast, Delivering Smart</p>
