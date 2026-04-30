import Leave from "../models/Leave.js";

export const applyLeave = async (req, res) => {
  const { type, fromDate, toDate, reason } = req.body;
  const leave = await Leave.create({
    employee: req.user._id,
    type, fromDate, toDate, reason,
  });
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
  const leaves = await Leave.find().populate("employee", "name email").sort({ createdAt: -1 });
  res.json(leaves);
};

export const updateLeaveStatus = async (req, res) => {
  const { status } = req.body;
  const leave = await Leave.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(leave);
};
