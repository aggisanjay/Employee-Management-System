import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Employee from "../models/Employee.js";

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const exists = await Employee.findOne({ email: process.env.ADMIN_EMAIL });
  if (exists) {
    console.log("Admin already exists");
    return process.exit(0);
  }
  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  await Employee.create({
    name: "John Doe",
    email: process.env.ADMIN_EMAIL,
    password: hashed,
    role: "admin",
    position: "Administrator",
    department: "Engineering",
    salary: 5000,
  });
  console.log("✅ Admin created");
  process.exit(0);
};
seed();
