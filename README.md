# 🚀 Employee Management System (EMS)

A premium, full-stack Employee Management System designed for modern organizations. This application streamlines workforce operations, tracks attendance with live timers, manages leave applications, and automates payroll generation with integrated email notifications.

## ✨ Key Features

### 🏢 Admin Portal
- **Dashboard**: Real-time stats for total employees, departments, and pending tasks.
- **Employee Management**: Full CRUD operations with separate first/last name fields and phone tracking.
- **Leave Control**: Review and approve/reject employee leave requests with automated email updates.
- **Payroll**: Generate monthly payslips and manage historical records.

### 👤 Employee Portal
- **Dashboard**: Personal overview with a customized "Welcome" greeting and stat cards.
- **Live Attendance**: Smart clock-in/out system with a live session timer and daily reminders.
- **Leave Requests**: Apply for Sick, Casual, or Annual leave with immediate status tracking.
- **Payslips**: View and download monthly payslips in a clean, professional format.

### ⚙️ Automation & Tech
- **Background Jobs**: Powered by **Inngest** for automated reminders (11:30 AM Attendance, 4:30 PM Check-out) and admin notifications.
- **Email System**: Automated welcome, notification, and reminder emails using **Nodemailer** with premium HTML templates.
- **Security**: JWT-based authentication with role-based access control (RBAC).

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React, React Hot Toast.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Workflows**: Inngest (Scheduled cron jobs & Event-driven tasks).
- **Styling**: Modern, premium UI with glassmorphism and smooth animations.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js installed
- MongoDB URI (Local or Atlas)
- Inngest Cloud account (for production)

### 2. Backend Setup
```bash
cd backend
npm install
# Create a .env file (see Environment Variables section below)
npm run seed       # Create default admin
npm run dev        # Start server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Create a .env file with VITE_API_URL=http://localhost:5000/api
npm run dev        # Start app on http://localhost:5173
```

### 4. Background Jobs (Local)
To run the Inngest dev server locally:
```bash
npx inngest-cli@latest dev -u http://localhost:5000/api/inngest
```

---

## 🌐 Production Deployment (Vercel)

### Backend
1. Deploy the `backend` folder as a separate project.
2. Add all backend environment variables to Vercel.
3. Configure Inngest Cloud to point to `https://your-backend.vercel.app/api/inngest`.

### Frontend
1. Deploy the `frontend` folder as a separate project.
2. Set `VITE_API_URL` to your production backend URL.

---

## 🔑 Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Connection String |
| `JWT_SECRET` | Secret for JWT Tokens |
| `ADMIN_EMAIL` | Default Admin Email |
| `ADMIN_PASSWORD` | Default Admin Password |
| `SMTP_USER` | Gmail/SMTP Username |
| `SMTP_PASS` | Gmail App Password |
| `INNGEST_EVENT_KEY` | Inngest Event Key (Production) |
| `INNGEST_SIGNING_KEY` | Inngest Signing Key (Production) |

---

## 📜 License
This project is licensed under the MIT License.
