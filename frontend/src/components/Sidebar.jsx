import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, Calendar, FileText, DollarSign, Settings, LogOut, ChevronRight, User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const adminLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/employees", icon: Users, label: "Employees" },
    { to: "/leave", icon: FileText, label: "Leave" },
    { to: "/payslips", icon: DollarSign, label: "Payslips" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  const employeeLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/attendance", icon: Calendar, label: "Attendance" },
    { to: "/leave", icon: FileText, label: "Leave" },
    { to: "/payslips", icon: DollarSign, label: "Payslips" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  const links = user?.role === "admin" ? adminLinks : employeeLinks;

  return (
    <aside className="w-[260px] bg-sidebar text-white flex flex-col h-screen sticky top-0 overflow-y-auto scrollbar-thin">
      <div className="p-6 flex items-center gap-3 border-b border-white/10 shrink-0">
        <div className="bg-white/10 p-2 rounded-lg"><User size={22} /></div>
        <div>
          <h1 className="font-semibold">Employee MS</h1>
          <p className="text-xs text-white/50">Management System</p>
        </div>
      </div>

      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-lg">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center font-semibold">
            {user?.firstName ? `${user.firstName[0]}${user.lastName?.[0] || ''}` : (user?.name?.[0] || 'U')}
          </div>
          <div>
            <p className="font-medium text-sm">{user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name}</p>


            <p className="text-xs text-white/50 capitalize">
              {user?.role === "admin" ? "Administrator" : "Employee"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <p className="text-xs text-white/40 uppercase mb-3 px-3">Navigation</p>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-lg mb-1 transition ${
                isActive ? "bg-primary text-white" : "text-white/70 hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-3">
                  <Icon size={18} /> {label}
                </span>
                {isActive && <ChevronRight size={16} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={() => { logout(); nav("/"); }}
        className="flex items-center gap-3 p-6 border-t border-white/10 text-white/70 hover:text-white"
      >
        <LogOut size={18} /> Log out
      </button>
    </aside>
  );
}
