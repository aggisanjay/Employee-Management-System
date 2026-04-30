import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PortalSelect() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen grid grid-cols-2">
      <div className="bg-[#1a1860] text-white p-16 flex flex-col justify-center">
        <h1 className="text-5xl font-bold mb-6">Employee<br />Management System</h1>
        <p className="text-white/70 max-w-md">
          Streamline your workforce operations, track attendance, manage payroll, and empower your team securely.
        </p>
      </div>
      <div className="flex flex-col justify-center px-20">
        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-500 mb-10">Select your portal to securely access the system.</p>

        {[
          { label: "Admin Portal", value: "admin" },
          { label: "Employee Portal", value: "employee" },
        ].map((p) => (
          <button
            key={p.value}
            onClick={() => nav(`/login/${p.value}`)}
            className="flex items-center justify-between p-5 mb-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition"
          >
            <span className="font-medium">{p.label}</span>
            <ArrowRight size={18} className="text-gray-400" />
          </button>
        ))}

        <p className="text-xs text-gray-400 mt-8">© 2026 aggi sanjay. All rights reserved.</p>
      </div>
    </div>
  );
}
