import Payslip from "../models/Payslip.js";
import Employee from "../models/Employee.js";

export const generatePayslip = async (req, res) => {
  const { employeeId, period, basicSalary, allowances = 0, deductions = 0 } = req.body;
  const netSalary = basicSalary + allowances - deductions;
  const payslip = await Payslip.create({
    employee: employeeId, period, basicSalary, allowances, deductions, netSalary,
  });
  res.status(201).json(payslip);
};

export const myPayslips = async (req, res) => {
  const payslips = await Payslip.find({ employee: req.user._id }).sort({ createdAt: -1 });
  res.json(payslips);
};

export const allPayslips = async (req, res) => {
  const payslips = await Payslip.find().populate("employee", "firstName lastName email department").sort({ createdAt: -1 });
  res.json(payslips);
};

export const getPayslip = async (req, res) => {
  const payslip = await Payslip.findById(req.params.id).populate("employee");
  res.json(payslip);
};
