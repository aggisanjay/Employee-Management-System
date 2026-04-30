import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Building2, Calendar, FileText, DollarSign, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [data, setData] = useState({});

  useEffect(() => {
    const url = user?.role === "admin" ? "/dashboard/admin" : "/dashboard/employee";
    api.get(url).then((r) => setData(r.data));
  }, [user]);

  if (user?.role === "admin") {
    return (
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mb-8">Welcome back, Admin — here's your overview</p>
        <div className="grid grid-cols-4 gap-5">
          <StatCard icon={Users} label="Total Employees" value={data.totalEmployees ?? 0} />
          <StatCard icon={Building2} label="Departments" value={data.departments ?? 0} />
          <StatCard icon={Calendar} label="Today's Attendance" value={data.todayAttendance ?? 0} />
          <StatCard icon={FileText} label="Pending Leaves" value={data.pendingLeaves ?? 0} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome, {user?.name?.split(" ")[0]}!</h1>
      <p className="text-gray-500 mb-8">{user?.position} - {user?.department}</p>
      <div className="grid grid-cols-3 gap-5 mb-6">
        <StatCard icon={Calendar} label="Days Present" value={data.daysPresent ?? 0} />
        <StatCard icon={FileText} label="Pending Leaves" value={data.pendingLeaves ?? 0} />
        <StatCard icon={DollarSign} label="Latest Payslip" value={`$${data.latestPayslip ?? 0}`} />
      </div>
      <div className="flex gap-3">
        <button onClick={() => nav("/attendance")}
          className="bg-primary text-white px-5 py-2.5 rounded-lg flex items-center gap-2">
          Mark Attendance <ArrowRight size={16} />
        </button>
        <button onClick={() => nav("/leave")}
          className="bg-white border border-gray-200 px-5 py-2.5 rounded-lg">
          Apply for Leave
        </button>
      </div>
    </div>
  );
}
