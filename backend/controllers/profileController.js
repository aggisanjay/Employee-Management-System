import bcrypt from "bcryptjs";
import Employee from "../models/Employee.js";

export const updateProfile = async (req, res) => {
  const { name, email, position, bio } = req.body;
  const updated = await Employee.findByIdAndUpdate(
    req.user._id,
    { name, email, position, bio },
    { new: true }
  ).select("-password");
  res.json(updated);
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await Employee.findById(req.user._id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) return res.status(400).json({ message: "Old password incorrect" });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Password updated" });
};
