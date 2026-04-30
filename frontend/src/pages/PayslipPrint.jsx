import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Printer } from "lucide-react";
import api from "../utils/api";

export default function PayslipPrint() {
  const { id } = useParams();
  const [p, setP] = useState(null);

  useEffect(() => {
    api.get(`/payslips/${id}`).then((r) => setP(r.data));
  }, [id]);

  if (!p) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-3xl mx-auto bg-white p-10 rounded-xl shadow-lg print:shadow-none">
        <div className="flex justify-between items-start border-b pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold">PAYSLIP</h1>
            <p className="text-gray-500">{p.period}</p>
          </div>
          <button onClick={() => window.print()}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 print:hidden">
            <Printer size={16} /> Print
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <p className="text-xs text-gray-500 uppercase">Employee</p>
            <p className="font-semibold">{p.employee?.name}</p>
            <p className="text-sm text-gray-500">{p.employee?.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Department</p>
            <p className="font-semibold">{p.employee?.department}</p>
            <p className="text-sm text-gray-500">{p.employee?.position}</p>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 flex justify-between border-b">
            <span>Basic Salary</span><span className="font-semibold">${p.basicSalary}</span>
          </div>
          <div className="p-4 flex justify-between border-b text-green-700">
            <span>Allowances</span><span className="font-semibold">+${p.allowances}</span>
          </div>
          <div className="p-4 flex justify-between border-b text-red-700">
            <span>Deductions</span><span className="font-semibold">-${p.deductions}</span>
          </div>
          <div className="p-4 flex justify-between bg-gray-50 font-bold text-lg">
            <span>Net Salary</span><span>${p.netSalary}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
