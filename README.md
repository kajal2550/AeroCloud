# ✈️ AeroCloud — Next-Gen Flight Management & Reservation System

<div align="center">
  <img src="https://images.unsplash.com/photo-1542296332-2e4473faf563?w=800&q=80" alt="AeroCloud Banner" width="700" />
  
  <p align="center">
    <a href="https://aero-cloud-igmh.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/Live%20Demo-🚀%20View%20Project-blueviolet?style=for-the-badge&logo=vercel" alt="Live Demo" />
    </a>
  </p>

  <p align="center">
    <h3>Elevate Your Journey with India's Most Premium Airline Management Portal 🚀</h3>
    <a href="https://aero-cloud-igmh.vercel.app/"><strong>Live Preview: aero-cloud-igmh.vercel.app</strong></a>
  </p>
</div>

---

## 🌟 About The Project
**AeroCloud** is a premium, high-fidelity Full-Stack Flight Management & Booking application designed to mirror industry leaders like Emirates and Qatar Airways. It features a seamless dark-mode glassmorphism interface, real-time seat synchronization, and a robust cloud-based backend.

Whether it's the smooth engine-vibration takeoff animations or the voice-enabled flight search, AeroCloud is built for speed, aesthetics, and unmatched user experience.

---

## 🚀 Key Features

### 💎 Premium User Experience
- **Smooth Takeoff Simulation:** Authentic hero background animations with vibration and acceleration effects. 🛫
- **Dark Mode Glassmorphism:** A sleek, futuristic UI built with advanced CSS and Framer Motion. 🌙
- **Real-Time Seat Locking:** Powered by **Socket.io**, preventing double bookings in real-time. 💺
- **Voice-Activated Search:** Search for destinations across the globe using your voice. 🎙️

### 📊 Advanced Management
- **Live Cloud Database:** Integrated with **MongoDB Atlas** for 24/7 data availability. ☁️
- **Dynamic Booking Flow:** A 3-step process comprising Passenger Entry, Seat Map Selection, and Bill Verification.
- **Flight Status Hub:** Live tracking of flight statuses (On Time, Delayed, Cancelled). 📡
- **Currency Switcher:** Toggle between USD, INR, EUR, and GBP dynamically. 💸

### 🔐 Secure & Fast
- **JWT Authentication:** Secure login/register flow for users.
- **Razorpay Integration:** A custom-built, high-fidelity payment modal for secure transactions. 💳
- **Email Notifications:** Automated ticket booking confirmations (via Nodemailer). 📧

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React.js** | Frontend UI & State Management |
| **Node.js** | Runtime Environment for Backend |
| **Express.js** | Fast & Minimal Backend Framework |
| **MongoDB Atlas** | Live Production Cloud Database |
| **Socket.io** | Real-Time Bidirectional Communication |
| **Framer Motion** | High-Quality Animations & Transitions |
| **Lucide React** | Modern SVG Icons |

---

## 📂 Project Structure

```text
AeroCloud/
├── 📁 frontend/            # React Application
│   ├── 📁 src/
│   │   ├── 📁 components/  # Reusable UI (Navbar, Modals, Forms)
│   │   ├── 📁 context/     # Auth, Theme, Socket, Notifications
│   │   ├── 📁 pages/       # Home, Checkout, Dashboard, Status
│   │   └── 📄 App.js       # Main Routing
│   └── 🎨 index.css        # Global Glassmorphism Design System
│
└── 📁 backend/             # Node Express Server
    ├── 📁 controllers/     # Business Logic
    ├── 📁 models/          # MongoDB Schemas (User, Flight, Booking)
    ├── 📁 routes/          # API Endpoints
    └── 📄 server.js        # Server Entry & Socket.io Logic
```

---

## ⚙️ How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KajalRajput/AeroCloud.git
   ```

2. **Install Dependencies:**
   ```bash
   # Both in frontend and backend folders
   npm install
   ```

3. **Setup Environment Variables:**
   Create a `.env` in the backend folder:
   ```env
   MONGO_URI=your_live_atlas_uri
   JWT_SECRET=your_secret
   PORT=5000
   ```

4. **Start the Application:**
   ```bash
   # Backend
   npm run dev
   # Frontend
   npm run dev
   ```

---

## 👤 Developer Profile

**Kajal Rajput**  
*Full-Stack Web Developer | UI/UX Designer*

- **LinkedIn:** [linkedin.com/in/kajalrajput](https://linkedin.com/in/kajalrajput)
- **GitHub:** [@KajalRajput](https://github.com/KajalRajput)
- **Email:** kajal.rajput@example.com

---

## 🏆 Project Recognition
Designed with ❤️ to demonstrate advanced MERN integration, real-time networking, and high-fidelity CSS styling.

---
<p align="center">Made with Love and Passion for the Future of Aviation ✈️⚡️</p>
