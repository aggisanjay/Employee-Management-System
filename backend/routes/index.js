import express from "express";
import { login, me } from "../controllers/authController.js";
import { protect, adminOnly } from "../middleware/auth.js";
import * as emp from "../controllers/employeeController.js";
import * as att from "../controllers/attendanceController.js";
import * as lv from "../controllers/leaveController.js";
import * as ps from "../controllers/payslipController.js";
import * as dash from "../controllers/dashboardController.js";
import * as prof from "../controllers/profileController.js";

const router = express.Router();

// Auth
router.post("/auth/login", login);
router.get("/auth/me", protect, me);

// Employees (Admin)
router.get("/employees", protect, adminOnly, emp.getAllEmployees);
router.post("/employees", protect, adminOnly, emp.createEmployee);
router.put("/employees/:id", protect, adminOnly, emp.updateEmployee);
router.delete("/employees/:id", protect, adminOnly, emp.deleteEmployee);

// Attendance
router.post("/attendance/checkin", protect, att.checkIn);
router.post("/attendance/checkout", protect, att.checkOut);
router.get("/attendance/me", protect, att.myAttendance);

// Leave
router.post("/leaves", protect, lv.applyLeave);
router.get("/leaves/me", protect, lv.myLeaves);
router.get("/leaves", protect, adminOnly, lv.allLeaves);
router.put("/leaves/:id", protect, adminOnly, lv.updateLeaveStatus);

// Payslips
router.post("/payslips", protect, adminOnly, ps.generatePayslip);
router.get("/payslips/me", protect, ps.myPayslips);
router.get("/payslips", protect, adminOnly, ps.allPayslips);
router.get("/payslips/:id", protect, ps.getPayslip);

// Dashboard
router.get("/dashboard/admin", protect, adminOnly, dash.adminDashboard);
router.get("/dashboard/employee", protect, dash.employeeDashboard);

// Profile
router.put("/profile", protect, prof.updateProfile);
router.put("/profile/password", protect, prof.changePassword);

export default router;
