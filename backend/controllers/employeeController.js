import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";
import { sendEmail } from "../utils/mailer.js";


export const getAllEmployees = async (req, res) => {
  const { search, department } = req.query;
  const filter = { role: "employee" };
  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (department && department !== "all") filter.department = department;
  const employees = await Employee.find(filter).select("-password");
  res.json(employees);
};

export const createEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, password, position, department, salary, phone } = req.body;
    const exists = await Employee.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password || "password123", 10);
    const employee = await Employee.create({
      firstName, lastName, email, password: hashed, position, department, salary, phone, role: "employee",
    });

    // Send Welcome Email
    await sendEmail(
      email,
      "Welcome to EMS",
      null,
      `<div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>Welcome to the team, ${firstName}! 🎉</h2>
        <p>Your employee account has been created successfully.</p>
        <p><strong>Role:</strong> ${position}</p>
        <p><strong>Department:</strong> ${department}</p>
        <p>You can now log in to the employee portal using your email.</p>
      </div>`
    );

    res.status(201).json(employee);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateEmployee = async (req, res) => {
  const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteEmployee = async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Employee deleted" });
};
