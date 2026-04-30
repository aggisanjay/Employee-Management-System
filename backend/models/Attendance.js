import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    date: { type: Date, required: true },
    checkIn: { type: Date },
    checkOut: { type: Date },
    workingHours: { type: Number, default: 0 },
    dayType: { type: String, enum: ["Full Day", "Half Day", "Absent"], default: "Full Day" },
    status: { type: String, enum: ["PRESENT", "ABSENT", "LATE"], default: "PRESENT" },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
