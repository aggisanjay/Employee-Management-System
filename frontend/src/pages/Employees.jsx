import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, Mail, Wallet, Briefcase } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", position: "", department: "Engineering", salary: 0, phone: "" });
  const [loading, setLoading] = useState(false);

  const load = () => api.get(`/employees?search=${search}`).then((r) => setEmployees(r.data));
  useEffect(() => { load(); }, [search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/employees/${editingId}`, form);
        toast.success("Employee updated");
      } else {
        await api.post("/employees", form);
        toast.success("Employee added");
      }
      closeModal();
      load();
    } catch (err) { 
      toast.error(err.response?.data?.message || "Failed"); 
    } finally {
      setLoading(false);
    }
  };

  const deleteEmp = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    try {
      await api.delete(`/employees/${id}`);
      toast.success("Employee deleted");
      load();
    } catch { toast.error("Failed to delete"); }
  };

  const openEdit = (emp) => {
    setEditingId(emp._id);
    setForm({ ...emp, password: "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ firstName: "", lastName: "", email: "", password: "", position: "", department: "Engineering", salary: 0, phone: "" });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-gray-500">Manage your workforce with precision</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20">
          <Plus size={18} /> Add Employee
        </button>
      </div>

      <div className="flex gap-4 my-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 p-3.5 bg-white border border-gray-100 rounded-xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition shadow-sm"
          />
        </div>
        <select className="p-3.5 bg-white border border-gray-100 rounded-xl outline-none text-gray-500 font-medium cursor-pointer shadow-sm">
          <option>All Departments</option>
          <option>Engineering</option>
          <option>Design</option>
          <option>Marketing</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {employees.map((e) => (
          <div key={e._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 relative border-t-4 border-t-primary/20">
            <div className="p-5 flex justify-between items-center">
              <span className="text-[10px] tracking-widest uppercase px-2.5 py-1 bg-primary/5 text-primary rounded-md font-bold">{e.department}</span>
              <div className="flex gap-1">
                <button onClick={() => openEdit(e)} className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition"><Edit2 size={14} /></button>
                <button onClick={() => deleteEmp(e._id)} className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition"><Trash2 size={14} /></button>
              </div>
            </div>

            <div className="flex flex-col items-center pb-6 border-b border-gray-50">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                {e.firstName?.[0] || e.name?.[0] || "U"}{e.lastName?.[0] || ""}
              </div>
              <h3 className="font-bold text-xl text-gray-800">{e.firstName ? `${e.firstName} ${e.lastName}` : e.name}</h3>

              <p className="text-gray-400 flex items-center gap-1.5 text-sm mt-1 uppercase tracking-tight font-medium">
                <Briefcase size={12} /> {e.position}
              </p>
            </div>

            <div className="p-5 bg-gray-50/30 grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400"><Mail size={14} /></div>
                <span className="text-sm truncate">{e.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-500">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400"><Wallet size={14} /></div>
                <span className="text-sm font-bold text-gray-700">${e.salary.toLocaleString()} <span className="text-[10px] text-gray-400 font-normal uppercase">/ yearly</span></span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold mb-6">{editingId ? "Edit Employee" : "Add Employee"}</h2>
            <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {["firstName", "lastName"].map((f) => (
                <div key={f}>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">{f.replace(/([A-Z])/g, ' $1')}</label>
                  <input
                    required
                    value={form[f]}
                    onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                    className="w-full p-3 mt-1 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-primary focus:bg-white transition"
                  />
                </div>
              ))}
            </div>
            <div className="space-y-4 mt-4">
              {["email", "password", "position", "department", "phone"].map((f) => (
                <div key={f}>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">{f}</label>
                  <input
                    required={f !== "department" && f !== "phone" && (!editingId || f !== "password")}
                    type={f === "password" ? "password" : "text"}
                    placeholder={editingId && f === "password" ? "Leave blank to keep current" : ""}
                    value={form[f]}
                    onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                    className="w-full p-3 mt-1 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-primary focus:bg-white transition"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Salary</label>
                <input
                  type="number"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: +e.target.value })}
                  className="w-full p-3 mt-1 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-primary focus:bg-white transition"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button type="button" onClick={closeModal}
                className="flex-1 p-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition">Cancel</button>
              <button type="submit" disabled={loading}
                className={`flex-1 p-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/20 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (editingId ? "Update" : "Create")}
              </button>
            </div>
          </div>
        </form>


        </div>
      )}
    </div>
  );
}
