import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";

export const getAllEmployees = async (req, res) => {
  const { search, department } = req.query;
  const filter = { role: "employee" };
  if (search) filter.name = { $regex: search, $options: "i" };
  if (department && department !== "all") filter.department = department;
  const employees = await Employee.find(filter).select("-password");
  res.json(employees);
};

export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, position, department, salary } = req.body;
    const exists = await Employee.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password || "password123", 10);
    const employee = await Employee.create({
      name, email, password: hashed, position, department, salary, role: "employee",
    });
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
