# Mini CRM System 🚀

A modern, full-stack Customer Relationship Management (CRM) system built with the MERN stack. Designed for efficiency, this application features a sleek dark-mode interface, real-time analytics, and comprehensive management for leads, companies, and tasks.

![Mini CRM Preview](https://img.shields.io/badge/Status-Live-success)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 🌟 Key Features

- **📊 Dynamic Dashboard:** Real-time stats and visual charts (Recharts) showing conversion rates and pipeline status.
- **💼 Company Management:** Full CRUD operations to manage business entities.
- **🎯 Lead Tracking:** Manage potential customers with status tracking (New, Contacted, Qualified, Lost).
- **✅ Task System:** Assign and track follow-up tasks linked to specific leads.
- **🔐 Secure Auth:** JWT-based authentication with Role-Based Access Control (Admin/User).
- **🎨 Modern UI:** Responsive, high-performance interface built with Material UI (MUI) and sleek dark mode.

---

## 🛠️ Technology Stack

### Frontend
- **React (Vite)** — High-performance UI library.
- **Material UI (MUI)** — Professional component library.
- **Recharts** — For data visualization and analytics.
- **Axios** — API communication with global error handling.
- **React Router Dom** — Client-side routing.

### Backend
- **Node.js & Express** — Robust API server.
- **MongoDB & Mongoose** — NoSQL database for flexible data modeling.
- **JWT (JSON Web Tokens)** — Secure authentication.
- **Bcryptjs** — Password hashing for security.

---

## 📂 Project Structure

```text
Mini_CRM/
├── client/              # React Frontend (Vite)
├── server/              # Express Backend API
├── package.json         # Root scripts for deployment
└── netlify.toml         # Optional Netlify configuration
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Setup
Clone the repository and install dependencies for both parts:
```bash
# From the root directory
npm run install-all
```

### 3. Environment Variables
Create a `.env` file in the `server/` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Run the App
```bash
# Run backend (from root)
npm run server

# Run frontend (from root)
npm run client
```
The app will be available at `http://localhost:5173`.

---

## 🌍 Deployment (Render - Single Server)

This project is configured for **Single-Server Deployment**, where Express serves the React production build.

1.  **Build Command:** `npm run render-build`
2.  **Start Command:** `npm start`
3.  **Environment Variables on Render:**
    - `MONGO_URI`: Your MongoDB Atlas string.
    - `JWT_SECRET`: A secure random string.
    - `NODE_ENV`: `production`

---

## 🛡️ Security
- Password hashing using `bcryptjs`.
- Protected API routes via JWT middleware.
- CORS protection (configured for production/development).
- Environment variable protection.

---

## 📄 License
This project is licensed under the MIT License.

---

Created by [Aathirithika S](https://github.com/aathi2005) 💻
