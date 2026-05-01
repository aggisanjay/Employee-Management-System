import { useState } from "react";
import { User, Lock, Save } from "lucide-react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Settings() {
  const { user, setUser } = useAuth();
  const isAdmin = user?.role === "admin";
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    position: user?.position || "",
    bio: user?.bio || "",
    phone: user?.phone || "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [pwd, setPwd] = useState({ oldPassword: "", newPassword: "" });

  const save = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put("/profile", form);
      setUser(data);
      toast.success("Profile updated");
    } catch { toast.error("Failed"); }
  };

  const changePwd = async (e) => {
    e.preventDefault();
    try {
      await api.put("/profile/password", pwd);
      toast.success("Password changed");
      setShowPwd(false);
      setPwd({ oldPassword: "", newPassword: "" });
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Settings</h1>
      <p className="text-gray-500 mb-8">Manage your account and preferences</p>

      <form onSubmit={save} className="bg-white rounded-xl p-6 border border-gray-100 mb-6">
        <div className="flex items-center gap-2 mb-5 pb-4 border-b">
          <User size={18} className="text-primary" />
          <h2 className="font-semibold">Public Profile</h2>
        </div>
        <div className="grid grid-cols-2 gap-5 mb-5">
          <div>
            <label className="text-sm font-medium">First Name</label>
            <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium">Last Name</label>
            <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 mb-5">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" />
          </div>
        </div>
        <div className="mb-5">
          <label className="text-sm font-medium">Position</label>
          <input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}
            className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" />
        </div>
        <div className="mb-5">
          <label className="text-sm font-medium">Bio</label>
          <textarea rows="4" placeholder="Write a brief bio..." value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none" />
          <p className="text-xs text-gray-400 mt-1">This will be displayed on your profile.</p>
        </div>
        <div className="flex justify-end">
          <button className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition hover:bg-primary/90">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </form>

      <div className="bg-white rounded-xl p-5 border border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-50 p-3 rounded-lg"><Lock className="text-gray-600" size={20} /></div>
          <div>
            <p className="font-semibold">Password</p>
            <p className="text-sm text-gray-500">Update your account password</p>
          </div>
        </div>
        <button onClick={() => setShowPwd(true)}
          className="px-5 py-2 border border-gray-200 rounded-lg">Change</button>
      </div>

      {showPwd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form onSubmit={changePwd} className="bg-white p-8 rounded-xl w-[400px]">
            <h2 className="text-xl font-bold mb-5">Change Password</h2>
            <input type="password" required placeholder="Old password" value={pwd.oldPassword}
              onChange={(e) => setPwd({ ...pwd, oldPassword: e.target.value })}
              className="w-full p-3 mb-3 border border-gray-200 rounded-lg" />
            <input type="password" required placeholder="New password" value={pwd.newPassword}
              onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
              className="w-full p-3 mb-3 border border-gray-200 rounded-lg" />
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowPwd(false)}
                className="flex-1 p-3 border border-gray-200 rounded-lg">Cancel</button>
              <button type="submit" className="flex-1 p-3 bg-primary text-white rounded-lg">Update</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
