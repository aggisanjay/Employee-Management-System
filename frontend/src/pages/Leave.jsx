import { useEffect, useState } from "react";
import { Plus, Thermometer, Umbrella, Palmtree, Check, X } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Leave() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [leaves, setLeaves] = useState([]);
  const [counts, setCounts] = useState({ SICK: 0, CASUAL: 0, ANNUAL: 0 });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ type: "SICK", fromDate: "", toDate: "", reason: "" });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (isAdmin) {
      const { data } = await api.get("/leaves");
      setLeaves(data);
    } else {
      const { data } = await api.get("/leaves/me");
      setLeaves(data.leaves);
      setCounts(data.counts);
    }
  };
  useEffect(() => { load(); }, [isAdmin]);

  const apply = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/leaves", form);
      toast.success("Leave applied");
      setShowModal(false);
      load();
    } catch (err) { 
      toast.error("Failed"); 
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    await api.put(`/leaves/${id}`, { status });
    toast.success(`Leave ${status.toLowerCase()}`);
    load();
  };

  const fmt = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const statusColor = {
    APPROVED: "bg-green-50 text-green-700",
    REJECTED: "bg-red-50 text-red-700",
    PENDING: "bg-yellow-50 text-yellow-700",
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Leave Management</h1>
          <p className="text-gray-500">{isAdmin ? "Manage leave applications" : "Your leave history and requests"}</p>
        </div>
        {!isAdmin && (
          <button onClick={() => setShowModal(true)}
            className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2">
            <Plus size={18} /> Apply for Leave
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="grid grid-cols-3 gap-6 mb-10">
          {[
            { icon: Thermometer, label: "Sick Leave", val: counts.SICK, color: "text-red-500", bg: "bg-red-50" },
            { icon: Umbrella, label: "Casual Leave", val: counts.CASUAL, color: "text-blue-500", bg: "bg-blue-50" },
            { icon: Palmtree, label: "Annual Leave", val: counts.ANNUAL, color: "text-green-500", bg: "bg-green-50" },
          ].map((c) => (
            <div key={c.label} className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center gap-5 group hover:shadow-lg transition-all duration-300">
              <div className={`${c.bg} ${c.color} p-4 rounded-2xl transition-transform group-hover:scale-110`}>
                <c.icon size={24} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{c.label}</p>
                <p className="text-2xl font-extrabold text-gray-800">{c.val} <span className="text-sm font-normal text-gray-400">Days</span></p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-xs text-gray-500 uppercase">
              {isAdmin && <th className="text-left p-4">Employee</th>}
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Dates</th>
              <th className="text-left p-4">Reason</th>
              <th className="text-left p-4">Status</th>
              {isAdmin && <th className="text-left p-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {leaves.map((l) => (
              <tr key={l._id} className="border-t">
                {isAdmin && <td className="p-4">{l.employee?.firstName ? `${l.employee.firstName} ${l.employee.lastName}` : l.employee?.name}</td>}
                <td className="p-4"><span className="px-3 py-1 bg-gray-100 rounded text-xs font-medium">{l.type}</span></td>
                <td className="p-4 text-gray-600">{fmt(l.fromDate)} — {fmt(l.toDate)}</td>
                <td className="p-4 text-gray-600">{l.reason}</td>
                <td className="p-4"><span className={`px-3 py-1 rounded text-xs font-medium ${statusColor[l.status]}`}>{l.status}</span></td>
                {isAdmin && (
                  <td className="p-4">
                    {l.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(l._id, "APPROVED")}
                          className="p-2 bg-green-50 text-green-700 rounded"><Check size={16} /></button>
                        <button onClick={() => updateStatus(l._id, "REJECTED")}
                          className="p-2 bg-red-50 text-red-700 rounded"><X size={16} /></button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={apply} className="bg-white p-8 rounded-xl w-[450px]">
            <h2 className="text-xl font-bold mb-5">Apply for Leave</h2>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full p-3 mb-3 border border-gray-200 rounded-lg">
              <option value="SICK">Sick</option>
              <option value="CASUAL">Casual</option>
              <option value="ANNUAL">Annual</option>
            </select>
            <input type="date" required value={form.fromDate}
              onChange={(e) => setForm({ ...form, fromDate: e.target.value })}
              className="w-full p-3 mb-3 border border-gray-200 rounded-lg" />
            <input type="date" required value={form.toDate}
              onChange={(e) => setForm({ ...form, toDate: e.target.value })}
              className="w-full p-3 mb-3 border border-gray-200 rounded-lg" />
            <textarea required placeholder="Reason" value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              className="w-full p-3 mb-3 border border-gray-200 rounded-lg" rows="3" />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowModal(false)}
                className="flex-1 p-3 border border-gray-200 rounded-lg">Cancel</button>
              <button type="submit" disabled={loading} className={`flex-1 p-3 bg-primary text-white rounded-lg flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : "Apply"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
