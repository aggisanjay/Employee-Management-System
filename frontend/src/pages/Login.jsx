import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { portal } = useParams();
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password, portal);
      toast.success("Logged in!");
      nav("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid grid-cols-2">
      <div className="bg-[#1a1860] text-white p-16 flex flex-col justify-center">
        <h1 className="text-5xl font-bold mb-6">Employee<br />Management System</h1>
        <p className="text-white/70 max-w-md">
          Streamline your workforce operations, track attendance, manage payroll, and empower your team securely.
        </p>
      </div>
      <div className="flex flex-col justify-center px-20">
        <Link to="/" className="text-gray-500 flex items-center gap-2 mb-8 text-sm">
          <ArrowLeft size={16} /> Back to portals
        </Link>
        <h2 className="text-3xl font-bold mb-1 capitalize">{portal} Portal</h2>
        <p className="text-gray-500 mb-8">Sign in to access your account</p>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-sm font-medium">Email address</label>
            <input
              type="email"
              required
              placeholder="john@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative mt-1">
              <input
                type={show ? "text" : "password"}
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full p-3 bg-gray-50 rounded-lg border border-gray-200 outline-none focus:border-primary pr-10"
              />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-3 text-gray-400">
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button disabled={loading}
            className="w-full bg-primary text-white p-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50">
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
