import Leave from "../models/Leave.js";
import Employee from "../models/Employee.js";
import { sendEmail } from "../utils/mailer.js";

export const applyLeave = async (req, res) => {
  const { type, fromDate, toDate, reason } = req.body;
  const leave = await Leave.create({
    employee: req.user._id,
    type, fromDate, toDate, reason,
  });

  // Notify Admins
  const admins = await Employee.find({ role: "admin" });
  for (const admin of admins) {
    await sendEmail(
      admin.email,
      "New Leave Application",
      null,
      `<div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>New Leave Request</h2>
        <p><strong>Employee:</strong> ${req.user.firstName} ${req.user.lastName}</p>
        <p><strong>Type:</strong> ${type}</p>
        <p><strong>Period:</strong> ${new Date(fromDate).toLocaleDateString()} to ${new Date(toDate).toLocaleDateString()}</p>
        <p><strong>Reason:</strong> ${reason}</p>
        <p>Please review it in the admin portal.</p>
      </div>`
    );
  }

  res.status(201).json(leave);
};

export const myLeaves = async (req, res) => {
  const leaves = await Leave.find({ employee: req.user._id }).sort({ createdAt: -1 });
  const counts = {
    SICK: leaves.filter((l) => l.type === "SICK" && l.status === "APPROVED").length,
    CASUAL: leaves.filter((l) => l.type === "CASUAL" && l.status === "APPROVED").length,
    ANNUAL: leaves.filter((l) => l.type === "ANNUAL" && l.status === "APPROVED").length,
  };
  res.json({ leaves, counts });
};

export const allLeaves = async (req, res) => {
  const leaves = await Leave.find().populate("employee", "firstName lastName email department").sort({ createdAt: -1 });
  res.json(leaves);
};

export const updateLeaveStatus = async (req, res) => {
  const { status } = req.body;
  const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true }).populate("employee");
  
  if (leave && leave.employee) {
    await sendEmail(
      leave.employee.email,
      `Leave Request ${status}`,
      null,
      `<div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>Leave Request Update</h2>
        <p>Hi ${leave.employee.firstName},</p>
        <p>Your leave request from <strong>${new Date(leave.fromDate).toLocaleDateString()}</strong> has been <strong>${status}</strong>.</p>
        <p>Best Regards,<br/>EMS Team</p>
      </div>`
    );
  }

  res.json(leave);
};
