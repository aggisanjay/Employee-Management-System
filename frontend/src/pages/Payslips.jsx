import { useEffect, useState } from "react";
import { Download, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Payslips() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const nav = useNavigate();
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employeeId: "", period: "", basicSalary: 0, allowances: 0, deductions: 0 });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const url = isAdmin ? "/payslips" : "/payslips/me";
    const { data } = await api.get(url);
    setPayslips(data);
  };

  useEffect(() => {
    load();
    if (isAdmin) api.get("/employees").then((r) => setEmployees(r.data));
  }, [isAdmin]);

  const generate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/payslips", form);
      toast.success("Payslip generated");
      setShowModal(false);
      load();
    } catch { 
      toast.error("Failed"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Payslips</h1>
          <p className="text-gray-500">{isAdmin ? "Generate and manage employee payslips" : "Your payslip history"}</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowModal(true)}
            className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2">
            <Plus size={18} /> Generate Payslip
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-xs text-gray-500 uppercase">
              {isAdmin && <th className="text-left p-4">Employee</th>}
              <th className="text-left p-4">Period</th>
              <th className="text-left p-4">Basic Salary</th>
              <th className="text-left p-4">Net Salary</th>
              <th className="text-left p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {payslips.map((p) => (
              <tr key={p._id} className="border-t">
                {isAdmin && <td className="p-4">{p.employee?.firstName ? `${p.employee.firstName} ${p.employee.lastName}` : p.employee?.name}</td>}
                <td className="p-4 text-gray-600">{p.period}</td>
                <td className="p-4">${p.basicSalary.toLocaleString()}</td>
                <td className="p-4">${p.netSalary.toLocaleString()}</td>
                <td className="p-4">
                  <button onClick={() => nav(`/payslip/${p._id}`)}
                    className="text-blue-600 bg-blue-50 px-4 py-2 rounded text-sm flex items-center gap-2">
                    <Download size={14} /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={generate} className="bg-white p-8 rounded-xl w-[450px]">
            <h2 className="text-xl font-bold mb-5">Generate Payslip</h2>
            <select required value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
              className="w-full p-3 mb-3 border border-gray-200 rounded-lg">
              <option value="">Select Employee</option>
              {employees.map((e) => <option key={e._id} value={e._id}>{e.firstName ? `${e.firstName} ${e.lastName}` : e.name}</option>)}
            </select>
            <input required placeholder="Period (e.g. February 2026)" value={form.period}
              onChange={(e) => setForm({ ...form, period: e.target.value })}
              className="w-full p-3 mb-3 border border-gray-200 rounded-lg" />
            <input type="number" required placeholder="Basic Salary"
              onChange={(e) => setForm({ ...form, basicSalary: +e.target.value })}
              className="w-full p-3 mb-3 border border-gray-200 rounded-lg" />
            <input type="number" placeholder="Allowances"
              onChange={(e) => setForm({ ...form, allowances: +e.target.value })}
              className="w-full p-3 mb-3 border border-gray-200 rounded-lg" />
            <input type="number" placeholder="Deductions"
              onChange={(e) => setForm({ ...form, deductions: +e.target.value })}
              className="w-full p-3 mb-3 border border-gray-200 rounded-lg" />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowModal(false)}
                className="flex-1 p-3 border border-gray-200 rounded-lg">Cancel</button>
              <button type="submit" disabled={loading} className={`flex-1 p-3 bg-primary text-white rounded-lg flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Generate"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
