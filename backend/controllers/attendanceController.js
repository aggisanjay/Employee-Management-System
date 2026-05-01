import Attendance from "../models/Attendance.js";
import { sendEmail } from "../utils/mailer.js";

export const checkIn = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await Attendance.findOne({
    employee: req.user._id,
    date: today,
  });
  if (existing) return res.status(400).json({ message: "Already checked in today" });

  const record = await Attendance.create({
    employee: req.user._id,
    date: today,
    checkIn: new Date(),
    status: "PRESENT",
  });

  // Send immediate check-in email
  const firstName = req.user.firstName;
  await sendEmail(
    req.user.email,
    "Check-in Confirmation",
    null,
    `<div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Hi ${firstName}, 👋</h2>
      <p>You have successfully checked in today.</p>
      <p><strong>Time:</strong> ${new Date().toLocaleTimeString()}</p>
      <p>Have a great day at work!</p>
    </div>`
  );

  res.json(record);
};

export const checkOut = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const record = await Attendance.findOne({ employee: req.user._id, date: today });
  if (!record) return res.status(404).json({ message: "No check-in found" });

  record.checkOut = new Date();
  const ms = record.checkOut - record.checkIn;
  record.workingHours = +(ms / (1000 * 60 * 60)).toFixed(2);
  record.dayType = record.workingHours >= 6 ? "Full Day" : "Half Day";
  await record.save();

  // Send immediate check-out email
  const firstName = req.user.firstName;
  await sendEmail(
    req.user.email,
    "Check-out Confirmation",
    null,
    `<div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Hi ${firstName}, 👋</h2>
      <p>You have successfully checked out for the day.</p>
      <p><strong>Time:</strong> ${record.checkOut.toLocaleTimeString()}</p>
      <p><strong>Working Hours:</strong> ${record.workingHours}h</p>
      <p>See you tomorrow!</p>
    </div>`
  );

  res.json(record);
};

export const myAttendance = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const records = await Attendance.find({ employee: req.user._id }).sort({ date: -1 });
  const activeRecord = records.find(r => r.date.getTime() === today.getTime() && !r.checkOut);

  const daysPresent = records.filter((r) => r.status === "PRESENT").length;
  const lateArrivals = records.filter((r) => r.status === "LATE").length;
  const totalHours = records.reduce((s, r) => s + r.workingHours, 0);
  const avgHours = records.length ? +(totalHours / records.length).toFixed(1) : 0;
  res.json({ records, daysPresent, lateArrivals, avgHours, activeRecord });
};
