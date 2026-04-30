import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";
import Payslip from "../models/Payslip.js";

export const adminDashboard = async (req, res) => {
  const totalEmployees = await Employee.countDocuments({ role: "employee" });
  const departments = (await Employee.distinct("department")).length;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todayAttendance = await Attendance.countDocuments({ date: today });
  const pendingLeaves = await Leave.countDocuments({ status: "PENDING" });
  res.json({ totalEmployees, departments, todayAttendance, pendingLeaves });
};

export const employeeDashboard = async (req, res) => {
  const daysPresent = await Attendance.countDocuments({ employee: req.user._id, status: "PRESENT" });
  const pendingLeaves = await Leave.countDocuments({ employee: req.user._id, status: "PENDING" });
  const latest = await Payslip.findOne({ employee: req.user._id }).sort({ createdAt: -1 });
  res.json({
    daysPresent,
    pendingLeaves,
    latestPayslip: latest?.netSalary || 0,
    user: { name: req.user.name, position: req.user.position, department: req.user.department },
  });
};
