# ⚡ ZapShift — Parcel Delivery Application

> A full-stack parcel delivery management platform connecting **Users**, **Riders**, and **Admins** through a centralized, real-time logistics system.

![ZapShift Banner](https://img.shields.io/badge/ZapShift-Parcel%20Delivery-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?style=flat-square&logo=mongodb)
![Firebase](https://img.shields.io/badge/Firebase-Auth-yellow?style=flat-square&logo=firebase)

---

## 🔗 Live Demo & Repository

- 🌐 **Frontend (Live):** [https://percel-web-application-hlmu.vercel.app/](https://percel-web-application-hlmu.vercel.app/)
- ⚙️ **Backend API (Live):** [https://percel-web-application.vercel.app/](https://percel-web-application.vercel.app/)
- 💻 **Client Repo:** [GitHub — Client](https://github.com/mesbahtoha/Percel-Web-Application/tree/main/zap-shift-client)
- 🖥️ **Server Repo:** [GitHub — server](https://github.com/mesbahtoha/Percel-Web-Application/tree/main/zap-shift-server)

---

## 🛠️ Admin Access

> Use the credentials below to sign in and access the admin dashboard.

| Item | Value |
|---|---|
| 🔑 **Admin Route** | http://localhost:5173/Md.Mesbhaul_Alam_Toha/ (prod: https://percel-web-application-hlmu.vercel.app/Md.Mesbhaul_Alam_Toha/) |
| 📧 **Email** | `alam242-50-012@diu.edu.bd` |
| 🔒 **Password** | `toha4321` |

### Admin Routes (local dev)

| Route | Description |
|---|---|
| `/Md.Mesbhaul_Alam_Toha/` | Admin Overview (dashboard) |
| `/Md.Mesbhaul_Alam_Toha/overview` | Overview (same as dashboard) |
| `/Md.Mesbhaul_Alam_Toha/manage-user` | Manage users |
| `/Md.Mesbhaul_Alam_Toha/manage-user/:id` | User details |
| `/Md.Mesbhaul_Alam_Toha/orders` | All orders |
| `/Md.Mesbhaul_Alam_Toha/orders/:id` | Order details |
| `/Md.Mesbhaul_Alam_Toha/parcel-tracking` | Parcel tracking |
| `/Md.Mesbhaul_Alam_Toha/payment-receive` | Payments received |
| `/Md.Mesbhaul_Alam_Toha/manage-rider` | Manage riders |
| `/Md.Mesbhaul_Alam_Toha/manage-rider/:id` | Rider details |
| `/Md.Mesbhaul_Alam_Toha/rider-assign` | Assign riders to parcels |
| `/Md.Mesbhaul_Alam_Toha/rider-payment` | Rider payments |
| `/Md.Mesbhaul_Alam_Toha/rider-task-update` | Rider task updates |
| `/Md.Mesbhaul_Alam_Toha/notifications` | Admin notifications |

---

## 📌 Project Overview

**ZapShift** is a modern, full-stack parcel delivery web application. It eliminates manual logistics processes by providing a streamlined platform where users can book parcels, riders manage deliveries, and admins oversee the entire operation with real-time insights.

The platform supports **three distinct user roles**, each with a dedicated dashboard and feature set:

| Role | Key Responsibilities |
|------|----------------------|
| 👤 **User** | Book parcels, pay charges, track status, review service |
| 🏍️ **Rider** | Collect & deliver parcels, update statuses, OTP confirmation |
| 🛠️ **Admin** | Assign riders, manage routing, oversee warehouses, monitor operations |

---

## ✨ Key Features

### 👤 User Features
- Secure **registration & login** via Firebase Authentication
- **Book parcels** with detailed sender & receiver information
- **Real-time parcel tracking** with live status updates
- **Stripe payment integration** for delivery charges
- **Parcel history** — view all past deliveries with cost & status
- Submit **service reviews and ratings**

### 🏍️ Rider Features
- View **assigned deliveries** with full parcel & contact details
- **Update delivery status** — Picked Up → In Transit → Delivered
- **OTP-based secure delivery** confirmation
- **Live location sharing** for tracking purposes
- **Daily summary** of parcel count and earnings

### 🛠️ Admin Features
- **User & Rider Management** — add, edit, or remove accounts
- **Parcel Oversight** — monitor all active/inactive parcels and payments
- **Analytics Dashboard** — delivery stats, revenue & performance indicators
- **Region & Warehouse Management** — assign riders to specific areas
- **Manual Overrides** — update parcel status or reassign riders

---

## 🚀 Delivery Flow

```
User Books Parcel (Unpaid)
        ↓
User Pays → Status: Paid
        ↓
Admin Assigns Rider → Status: Ready to Pickup
        ↓
Rider Picks Up → Status: In Transit
        ↓
Within City?
  ├── YES → Rider Delivers → Status: Delivered ✅
  └── NO  → Sent to Warehouse → Shipped to Destination → Rider Delivers → Status: Delivered ✅
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React** | Core UI framework (NPM package) |
| **React Router DOM** | Client-side routing & navigation |
| **Tailwind CSS** | Utility-first styling |
| **DaisyUI** | Pre-built Tailwind component library |
| **Lucide React** | Modern icon library |
| **React Icons** | Additional icon sets |
| **Urbanist Font** | Custom typography (imported via index.css) |
| **React Responsive Carousel** | Homepage banner/slider |
| **React Fast Marquee** | Scrolling announcement banners |
| **React AOS** | Scroll-triggered animations |
| **React Hook Form** | Performant form handling & validation |
| **React Select** | Advanced dropdown/select component |
| **React Leaflet** | Interactive map integration |
| **MapContainer, TileLayer, Marker, Popup** | Map components for parcel tracking |

### Authentication & Backend Services
| Technology | Purpose |
|---|---|
| **Firebase** | Authentication & cloud services |
| **Firebase Admin SDK** | Server-side Firebase operations |
| **JWT (JSON Web Tokens)** | Secure route protection & authorization |

### Payments & Notifications
| Technology | Purpose |
|---|---|
| **React Stripe JS** | Stripe payment integration |
| **Nodemailer** | Email notifications to users |
| **SweetAlert2** | Beautiful alert/confirmation dialogs |
| **sweetalert2-react-content** | React integration for SweetAlert2 |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | RESTful API framework |
| **MongoDB** | NoSQL database for data persistence |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |
| **UUID** | Unique ID generation for parcels |

### Data Fetching
| Technology | Purpose |
|---|---|
| **TanStack Query (React Query)** | Server state management — replaces useEffect for data loading |
| **Axios** | HTTP client for API requests |

---

## 🏗️ Project Structure

```
Percel-Web-Application/
├── zap-shift-client/                     # React Frontend (Vite)
│   ├── public/
│   │   ├── serviceCenter.json            # 64 district service center data (map markers)
│   │   └── delivery-van.png              # Favicon
│   ├── src/
│   │   ├── Admin_Role/                   # Admin dashboard
│   │   │   ├── adminLayouts/             # AdminLayout (sidebar + navbar shell)
│   │   │   ├── adminPages/               # Overview, ManageUsers, Orders, Payments,
│   │   │   │                             #   ParcelTracking, ManageRiders, AssignRider,
│   │   │   │                             #   RiderPayments, RiderTaskUpdates, Notifications
│   │   │   └── AdminComponents/          # Shared admin UI (AdminNavbar, etc.)
│   │   ├── RiderRole/                    # Rider dashboard
│   │   │   ├── layouts/                  # RiderDashboardLayout
│   │   │   ├── pages/Rider/              # Overview, Tasks, Earnings, Profile, Notification
│   │   │   ├── components/               # Shared rider UI
│   │   │   └── routes/                   # PrivateRouteRider
│   │   ├── api/                          # API client modules (axios instances)
│   │   ├── assets/                       # Images, brands, illustrations
│   │   ├── context/AuthContext/          # Firebase auth provider
│   │   ├── coverage/                     # Coverage page + Leaflet map
│   │   │   ├── Coverage.jsx              # Search + district selection UI
│   │   │   └── BangladeshMap.jsx         # Leaflet MapContainer with 64 markers
│   │   ├── firebase/                     # Firebase initialization & config
│   │   ├── hooks/                        # useAxios, useAxiosSecure, etc.
│   │   ├── layouts/                      # RootLayout, DashboardLayout
│   │   ├── pages/                        # Route-level pages
│   │   │   ├── Home/                     # Landing page sections
│   │   │   ├── Authentication/           # Login, Register
│   │   │   ├── Dashboard/                # MyParcels, AddParcel, Payment, TrackParcel...
│   │   │   ├── SendParcel/               # Send parcel form
│   │   │   ├── BeARider/                 # Rider application
│   │   │   ├── About/                    # About page
│   │   │   └── shared/                   # Navbar, Footer, Profile, ProfastLogo
│   │   ├── router/router.jsx             # All application routes (single source)
│   │   ├── routes/                       # PrivateRoute, PublicRoute, PrivateRouteAdmin
│   │   ├── main.jsx                      # App entry (RouterProvider + providers)
│   │   └── index.css                     # Tailwind v4 + Urbanist font import
│   └── package.json
│
└── zap-shift-server/                     # Node.js Backend
    ├── src/
    │   ├── app.js                        # Express app setup (CORS, JSON, routes)
    │   ├── server.js                     # Server entry point
    │   ├── config/                       # db, env, firebase, mailer, stripe
    │   ├── controllers/                  # auth, parcel, payment, rider, user, admin...
    │   ├── middlewares/                  # auth (JWT), errorHandler
    │   ├── routes/                       # API route handlers
    │   ├── services/                     # mail, notification, riderTask, stripe
    │   └── utils/                        # ApiError, helpers
    ├── scripts/seed-admin.js             # Seed admin account
    ├── convertKey.js                     # Firebase service-account key converter
    ├── .env.example                      # Env template
    └── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js **v16 or higher**
- npm or yarn
- MongoDB Atlas account
- Firebase project
- Stripe account

### 1. Clone the Repository
```bash
git clone https://github.com/mesbahtoha/Percel-Web-Application.git
cd Percel-Web-Application
```

### 2. Frontend Setup
```bash
cd zap-shift-client
npm install
```

Create a `.env` file in the `client` folder:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_API_BASE_URL=http://localhost:5000
```

```bash
npm run dev
```

### 3. Backend Setup
```bash
cd zap-shift-server
npm install
```

Create a `.env` file in the `server` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FIREBASE_ADMIN_SDK=your_firebase_admin_config
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```

```bash
node index.js
```

---

## ▲ Vercel Deployment (Monorepo)

The frontend and backend live in the **same repository**. Vercel deploys them as **two separate projects** — each points to this repo with a different **Root Directory**.

> ✅ **Currently deployed:**
> - Frontend: https://percel-web-application-hlmu.vercel.app/
> - Backend: https://percel-web-application.vercel.app/

### 1. Deploy the Backend (`zap-shift-server`)

1. Go to [vercel.com](https://vercel.com) → **Add New Project** → import this repo
2. Set **Root Directory** to `zap-shift-server` (detected automatically by `vercel.json`)
3. Add these **Environment Variables** (Settings → Environment Variables):

   | Variable | Value |
   |---|---|
   | `MONGODB_URI` | MongoDB connection string |
   | `DB_USER` / `DB_PASSWORD` / `DB_NAME` | *(optional)* used when `MONGODB_URI` is empty |
   | `CLIENT_URL` | Frontend URL (e.g. `https://zap-shift-client.vercel.app`) — allowed by CORS |
   | `FB_SERVICE_KEY` | Firebase Admin service-account JSON (base64 encoded) |
   | `STRIPE_SECRET_KEY` | Stripe secret key |
   | `OTP_JWT_SECRET` | JWT secret for OTP tokens |
   | `EMAIL_SENDER` / `EMAIL_PASS` | Gmail SMTP credentials for OTP emails |

4. Click **Deploy**. The Express app runs as a serverless function via `api/index.js` (all routes → one lambda, MongoDB connection is cached across warm invocations).

### 2. Deploy the Frontend (`zap-shift-client`)

1. **Add New Project** → import the same repo
2. Set **Root Directory** to `zap-shift-client`
3. Add these **Environment Variables**:

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | Deployed backend URL (e.g. `https://zap-shift-server.vercel.app`) |
   | `VITE_apiKey` … `VITE_appId` | Firebase web-app config (same names as `.env.example`) |
   | `VITE_img_upload_key` | ImgBB API key |
   | `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

4. Click **Deploy**. `vercel.json` enables SPA rewrites, so deep links like `/coverage` and `/Md.Mesbhaul_Alam_Toha/` work on refresh.

### 3. Post-deployment checks

- Update `CLIENT_URL` on the backend if the frontend URL changes (Vercel preview deployments get new URLs)
- Add the deployed frontend domain to **Firebase Authentication** (Authorized domains)
- The production URL differs from localhost — admin sign-in credentials remain the same

---

## 💳 Pricing Structure

| Parcel Type | Weight | Within City | Outside City |
|---|---|---|---|
| Document | Any | ৳60 | ৳80 |
| Non-Document | Up to 3kg | ৳110 | ৳150 |
| Non-Document | Above 3kg | +৳40/kg | +৳40/kg (+৳40 extra) |

**Rider Earnings:**
- ৳80% of delivery charge for same-city deliveries
- ৳60% for outside city/district deliveries

---

## 🔐 Security Features

- **JWT Authentication** — Protected API routes with token-based auth
- **Firebase Auth** — Secure client-side authentication
- **Role-Based Access Control (RBAC)** — Separate permissions for User, Rider, and Admin
- **Environment Variables** — Sensitive credentials stored in `.env` files
- **CORS Configuration** — Controlled cross-origin access
- **OTP Delivery Confirmation** — Prevents unauthorized parcel collection

---

## 📦 NPM Packages Summary

```json
"dependencies": {
  "react": "^18.x",
  "react-router-dom": "^6.x",
  "tailwindcss": "^3.x",
  "daisyui": "^4.x",
  "react-responsive-carousel": "latest",
  "react-icons": "latest",
  "react-fast-marquee": "latest",
  "aos": "latest",
  "react-hook-form": "latest",
  "firebase": "latest",
  "react-leaflet": "latest",
  "react-select": "latest",
  "sweetalert2": "latest",
  "sweetalert2-react-content": "latest",
  "uuid": "latest",
  "@tanstack/react-query": "latest",
  "@stripe/react-stripe-js": "latest",
  "axios": "latest",
  "lucide-react": "latest"
}
```

---

## 📝 Recent Changes

### 🗺️ Fixed: Coverage map not showing (Aug 2026)

**Problem:** On `/coverage`, the Leaflet map (`src/coverage/BangladeshMap.jsx`) rendered nothing — the map area appeared blank.

**Root cause:** `.gitignore` contained a `coverage/` entry. Tailwind CSS v4's automatic source detection **skips files listed in `.gitignore`**, so `src/coverage/*.jsx` was never scanned for utility classes. As a result, the map container's height utilities (`h-[400px] sm:h-[500px] md:h-[600px]`) were missing from the compiled CSS and the container collapsed to `0px` height, hiding the map.

**Changes made:**
- `zap-shift-client/.gitignore` — removed the `coverage/` entry so Tailwind scans `src/coverage/`
- Restarted the Vite dev server to regenerate the CSS with the map height utilities

**How to verify:** Open http://localhost:5173/coverage — you should see the Bangladesh map with 64 district markers, and searching a district zooms the map to that location.

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
