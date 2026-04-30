import { Inngest } from "inngest";
import { serve } from "inngest/express";
import Payslip from "../models/Payslip.js";
import Employee from "../models/Employee.js";
import { sendEmail } from "../utils/mailer.js";

export const inngest = new Inngest({ id: "ems-app" });

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

export const inngestMiddleware = serve({
  client: inngest,
  functions: [monthlyPayslip, welcomeEmployee],
});
