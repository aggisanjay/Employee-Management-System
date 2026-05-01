import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
    position: { type: String, default: "" },
    department: { type: String, default: "General" },
    phone: { type: String, default: "" },
    salary: { type: Number, default: 0 },
    bio: { type: String, default: "" },
    joinedAt: { type: Date, default: Date.now },

  },
  { timestamps: true }
);

export default mongoose.model("Employee", employeeSchema);
