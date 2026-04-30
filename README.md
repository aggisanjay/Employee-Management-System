# 🚀 Employee Management System (EMS)

A premium, full-stack Employee Management System designed for modern organizations. This application streamlines workforce operations, tracks attendance with live timers, manages leave applications, and automates payroll generation.

## ✨ Key Features

### 🏢 Admin Portal
- **Dashboard**: Real-time stats for total employees, departments, and pending tasks.
- **Employee Management**: Full CRUD operations with a premium grid view and search.
- **Leave Control**: Review and approve/reject employee leave requests.
- **Payroll**: Generate monthly payslips and manage historical records.
- **Settings**: Manage administrative profile and security.

### 👤 Employee Portal
- **Dashboard**: Personal overview of attendance history, leave status, and latest payslips.
- **Live Attendance**: Smart clock-in/out system with a live session timer.
- **Leave Requests**: Apply for Sick, Casual, or Annual leave with ease.
- **Payslips**: View and download/print monthly payslips.

### ⚙️ Automation & Tech
- **Background Jobs**: Powered by **Inngest** for automated monthly payroll and email notifications.
- **Email System**: Automated welcome and notification emails via **Nodemailer**.
- **Security**: JWT-based authentication with role-based access control (RBAC).

---

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React, React Hot Toast.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose).
- **Workflows**: Inngest (Scheduled jobs & Event-driven tasks).
- **Icons & UI**: Lucide-React with a custom premium design system.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js installed
- MongoDB installed and running locally (or an Atlas URI)

### 2. Backend Setup
```bash
cd backend
npm install
# Configure your .env file with MONGO_URI, JWT_SECRET, and SMTP details
npm run seed       # Create default admin: admin@ems.com / admin123
npm run dev        # Start server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev        # Start app on http://localhost:5173
```

### 4. Background Jobs (Inngest)
To see background jobs and scheduled tasks in action:
```bash
npx inngest-cli@latest dev -u http://localhost:5000/api/inngest
```
Open [http://localhost:8288](http://localhost:8288) to view the Inngest dashboard.

---

## 🔑 Default Credentials

- **Admin**: `admin@ems.com` / `admin123`
- **Employee**: Create an employee via Admin Portal (Default password: `password123`)

---

## 📜 License
This project is licensed under the MIT License.
