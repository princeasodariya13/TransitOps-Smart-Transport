# 🚛 FleetFlow
**Live demo**
- Live vercel demo: https://transit-ops-smart-transport.vercel.app/

**Enterprise-Grade SaaS Fleet Management System**

FleetFlow is a comprehensive, scalable solution designed to digitize manual logbooks, optimize fleet lifecycles, and monitor driver performance. Built with a modern MERN stack combined with Prisma ORM, it provides real-time insights into vehicle status, maintenance needs, fuel consumption, operational costs, and real-time GPS tracking.

---

## 🚀 Key Features

- **📊 Intelligent Dashboard**: Real-time analytics, KPI tracking for fleet performance, and interactive data visualization using Chart.js.
- **📍 Real-Time GPS Tracking**: Live map tracking using WebSocket (`Socket.io`) and `Leaflet` to actively monitor vehicles that are currently "On Trip".
- **🚚 Vehicle & Maintenance Management**: Comprehensive tracking of vehicle lifecycles, capacities, and automated status toggles (In Shop/Available) through background jobs.
- **👨‍✈️ Driver Workforce**: Manage qualified personnel. Includes automated background jobs (`Nodemailer`) that daily check and alert administrators of upcoming driver license expiries.
- **🗺️ Trip Logging**: Digitized trip management with cargo validation, operator assignment, and workflow stages (Draft, Dispatched, Completed, Cancelled).
- **⛽ Fuel & Expense Monitoring**: Precise tracking of fuel consumption and ad-hoc expenses (Tolls, Fines, Parking) linked directly to vehicles and specific trips.
- **🔐 Advanced RBAC**: Role-based access control (Admin, Fleet Manager, Dispatcher, Safety Officer, Financial Analyst) with JWT authentication. Admin has "god-mode" access, while other roles have strictly tailored dashboard views.
- **📈 PDF & CSV Export**: Instantly generate and download beautifully formatted PDF Analytics Reports (using `jsPDF-autotable`) and CSV data dumps.
- **✅ API Integrity**: Fully guarded REST API utilizing robust `Zod` validation middleware for all data mutation endpoints.
- **📱 Fully Responsive**: A modernized UI that gracefully adapts to desktops, tablets, and mobile devices using a collapsible navigation drawer.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Mapping**: [React Leaflet](https://react-leaflet.js.org/)
- **Charts**: [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/)
- **Exporting**: [jsPDF](https://github.com/parallax/jsPDF) & [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable)
- **Real-time**: [Socket.io Client](https://socket.io/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Validation**: [Zod](https://zod.dev/)
- **Real-time**: [Socket.io](https://socket.io/)
- **Background Jobs**: Node native `setInterval` jobs for maintenance/expiry tracking
- **Email Service**: [Nodemailer](https://nodemailer.com/) (Supports SMTP & Ethereal testing)

---

## 📥 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster (Ensure your IP is whitelisted under Network Access)

### 1. Clone the Repository
```bash
git clone https://github.com/raxitsanghani/FleetFlow.git
cd FleetFlow
```

### 2. Backend Configuration
```bash
cd fleet-flow-backend
npm install
```

Create a `.env` file in the `fleet-flow-backend` root:
```env
PORT=5000
NODE_ENV=development

# MongoDB Connection Strings
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0...mongodb.net/fleetflow"
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0...mongodb.net/fleetflow"

# Auth
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173

# Email (Optional - falls back to Ethereal if omitted)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
ADMIN_EMAIL=admin_recipient@gmail.com
```

Push the Prisma schema to the database and generate the Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

*(Optional)* Seed the database with the Admin User:
```bash
node scripts/createAdmin.js
```
**Admin Login Credentials:**
- **Email:** `admin@gmail.com`
- **Password:** `admin@123`

### 3. Frontend Configuration
```bash
cd ../fleet-flow-frontend
npm install
```

Create a `.env` file in the `fleet-flow-frontend` root:
```env
VITE_API_URL=https://transitops-smart-transport.onrender.com/api
```

### 4. Run the Application
**Backend (runs on port 5000):**
```bash
cd fleet-flow-backend
npm run dev
```

**Frontend (runs on port 5173):**
```bash
cd fleet-flow-frontend
npm run dev
```

---

## 📂 Project Architecture

```text
FleetFlow/
├── fleet-flow-backend/             # 🛠️ BACKEND (Node.js + Express + Prisma + Socket.io)
│   ├── prisma/
│   │   └── schema.prisma           # 📝 Database schema, Models, and Indexes
│   ├── scripts/
│   │   └── createAdmin.js          # 👤 Script: Create or force-update Admin account
│   ├── src/
│   │   ├── controllers/            # 🧠 API Logic & Handlers
│   │   ├── jobs/                   # 🕒 Automated Background Jobs
│   │   │   ├── licenseExpiryJob.js # Alerts admin on expiring licenses
│   │   │   └── maintenanceStatusJob.js 
│   │   ├── middleware/             # 🛡️ Security, Validation & RBAC Interceptors
│   │   ├── routes/                 # 🛣️ API Endpoints mapping (Trips, Fuel, Expenses, etc.)
│   │   ├── services/               # ✉️ External services
│   │   │   └── email.service.js    # Nodemailer email configurations
│   │   ├── validations/            # 📏 Zod schemas for strict request validation
│   │   ├── app.js                  # 📦 Express app configuration
│   │   └── index.js                # 🚀 Main server setup (HTTP + WebSocket)
│   ├── .env                        # 🔐 Backend environment variables
│   └── package.json                
│
├── fleet-flow-frontend/            # 🎨 FRONTEND (React + Vite + Tailwind + Leaflet)
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js              # 🌐 Axios instance & API interceptors
│   │   ├── components/             # 🧩 Reusable UI Components
│   │   │   ├── LiveMap.jsx         # 📍 Socket.io + Leaflet Real-time map
│   │   │   ├── ExpenseModal.jsx
│   │   │   ├── Sidebar.jsx         # Dynamic RBAC Navigation menu
│   │   │   └── ProtectedRoute.jsx  # Role-based route guardian
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # 🔑 Global authentication state
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx # 🖼️ Master layout wrapper for pages
│   │   ├── pages/                  # 📄 Application Views
│   │   │   ├── Analytics.jsx       # Charts, PDF Export, CSV Export
│   │   │   ├── Dashboard.jsx       # Command Center & Live Map
│   │   │   ├── Expenses.jsx        # Expense tracking module
│   │   │   └── ... (Vehicles, Drivers, Trips, Maintenance, FuelLogs, Login, Register)
│   │   ├── App.jsx                 # 🔀 Frontend Route & RBAC definitions
│   │   └── main.jsx                # ⚛️ React entry point
│   └── package.json                
│
└── README.md                       # 📖 You are here
```

---

## 📄 License
This project is licensed under the ISC License.

---
*Built with ❤️ by the FleetFlow Team*
