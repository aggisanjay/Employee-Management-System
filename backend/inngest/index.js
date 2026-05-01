import { Inngest } from "inngest";
import { serve } from "inngest/express";
import Payslip from "../models/Payslip.js";
import Employee from "../models/Employee.js";
import Attendance from "../models/Attendance.js";
import Leave from "../models/Leave.js";
import { sendEmail } from "../utils/mailer.js";

export const inngest = new Inngest({ 
  id: "ems-app",
  eventKey: process.env.INNGEST_EVENT_KEY 
});

// Auto-generate payslips on the 1st of every month
const monthlyPayslip = inngest.createFunction(
  { id: "monthly-payslip" },
  { cron: "0 0 1 * *" },
  async ({ step }) => {
    const employees = await Employee.find({ role: "employee" });
    const now = new Date();
    const period = now.toLocaleString("default", { month: "long", year: "numeric" });

    for (const emp of employees) {
      await step.run(`payslip-${emp._id}`, async () => {
        const netSalary = emp.salary + 180; // sample calculation
        await Payslip.create({
          employee: emp._id,
          period,
          basicSalary: emp.salary,
          allowances: 200,
          deductions: 20,
          netSalary,
        });
        await sendEmail(emp.email, "Payslip Generated", `Your payslip for ${period} is ready.`);
      });
    }
    return { generated: employees.length };
  }
);

// Welcome email on new employee
const welcomeEmployee = inngest.createFunction(
  { id: "welcome-employee" },
  { event: "employee/created" },
  async ({ event }) => {
    await sendEmail(event.data.email, "Welcome to EMS", `Hi ${event.data.name}, welcome aboard!`);
  }
);

// Attendance Reminder (runs at 11:30 AM daily)
const attendanceReminder = inngest.createFunction(
  { id: "attendance-reminder" },
  { cron: "30 11 * * *" },
  async ({ step }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const employees = await Employee.find({ role: "employee" });

    for (const emp of employees) {
      await step.run(`remind-attendance-${emp._id}`, async () => {
        const attendance = await Attendance.findOne({
          employee: emp._id,
          date: { $gte: today },
        });

        if (!attendance || !attendance.checkIn) {
          const html = `
            <div style="max-width: 600px; font-family: Arial, sans-serif;">
              <h2>Hi ${emp.firstName}, 👋</h2>
              <p style="font-size: 16px;">We noticed you haven't marked your attendance yet today.</p>
              <p style="font-size: 16px;">The deadline was <strong>11:30 AM</strong> and your attendance is still missing.</p>
              <p style="font-size: 16px;">Please check in as soon as possible or contact your admin if you're facing any issues.</p>
              <br />
              <p style="font-size: 14px; color: #666;">Department: ${emp.department}</p>
              <br />
              <p style="font-size: 16px;">Best Regards,</p>
              <p style="font-size: 16px;"><strong>QuickEMS</strong></p>
            </div>
          `;
          await sendEmail(emp.email, "Attendance Reminder", null, html);
        }
      });
    }
  }
);

// Check-out Reminder (runs at 4:30 PM daily)
const checkoutReminder = inngest.createFunction(
  { id: "checkout-reminder" },
  { cron: "30 16 * * *" },
  async ({ step }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkIns = await Attendance.find({
      date: { $gte: today },
      checkIn: { $exists: true },
      checkOut: { $exists: false },
    }).populate("employee");

    for (const record of checkIns) {
      if (!record.employee) continue;
      await step.run(`remind-checkout-${record.employee._id}`, async () => {
        const html = `
          <div style="max-width: 600px;">
            <h2>Hi ${record.employee.firstName}, 👋</h2>
            <p style="font-size: 16px;">You have a check-in in ${record.employee.department} today:</p>
            <p style="font-size: 18px; font-weight: bold; color: #007bff; margin: 8px 0;">${record.checkIn.toLocaleTimeString()}</p>
            <p style="font-size: 16px;">Please make sure to check-out in one hour.</p>
            <p style="font-size: 16px;">If you have any questions, please contact your admin.</p>
            <br />
            <p style="font-size: 16px;">Best Regards,</p>
            <p style="font-size: 16px;">EMS</p>
          </div>
        `;
        await sendEmail(record.employee.email, "Check-out Reminder", null, html);
      });
    }
  }
);

// Leave Application Reminder for Admin (runs at 9:00 AM daily)
const leaveReminder = inngest.createFunction(
  { id: "leave-reminder" },
  { cron: "0 9 * * *" },
  async ({ step }) => {
    const pendingLeaves = await Leave.find({ status: "PENDING" }).populate("employee");
    if (pendingLeaves.length === 0) return;

    const admins = await Employee.find({ role: "admin" });

    for (const admin of admins) {
      await step.run(`remind-admin-leaves-${admin._id}`, async () => {
        let leaveItemsHtml = "";
        for (const leave of pendingLeaves) {
          const emp = leave.employee;
          leaveItemsHtml += `
            <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
              <p><strong>Employee:</strong> ${emp ? emp.firstName + ' ' + emp.lastName : "Unknown"}</p>
              <p><strong>Department:</strong> ${emp ? emp.department : "N/A"}</p>
              <p><strong>Start Date:</strong> ${new Date(leave.fromDate).toLocaleDateString()}</p>
              <p><strong>Reason:</strong> ${leave.reason}</p>
            </div>
          `;
        }

        const html = `
          <div style="max-width: 600px;">
            <h2>Hi Admin, 👋</h2>
            <p style="font-size: 16px;">You have pending leave applications that require action:</p>
            ${leaveItemsHtml}
            <p style="font-size: 16px; margin-top: 20px;">Please make sure to take action on these leave applications.</p>
            <br />
            <p style="font-size: 16px;">Best Regards,</p>
            <p style="font-size: 16px;">EMS</p>
          </div>
        `;
        await sendEmail(admin.email, "Pending Leave Applications Reminder", null, html);
      });
    }
  }
);

export const inngestMiddleware = serve({
  client: inngest,
  functions: [monthlyPayslip, welcomeEmployee, attendanceReminder, checkoutReminder, leaveReminder],
  signingKey: process.env.INNGEST_SIGNING_KEY,
});
