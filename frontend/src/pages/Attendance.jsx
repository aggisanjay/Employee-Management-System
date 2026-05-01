import { useEffect, useState } from "react";
import { Calendar, AlertCircle, Clock, LogIn, LogOut } from "lucide-react";
import api from "../utils/api";
import StatCard from "../components/StatCard";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

export default function Attendance() {
  const [data, setData] = useState({ records: [], daysPresent: 0, lateArrivals: 0, avgHours: 0, activeRecord: null });
  const [timer, setTimer] = useState("00:00:00");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const load = () => api.get("/attendance/me").then((r) => setData(r.data)).finally(() => setIsFetching(false));
  useEffect(() => { load(); }, []);

  useEffect(() => {
    let interval;
    if (data.activeRecord) {
      interval = setInterval(() => {
        const start = new Date(data.activeRecord.checkIn);
        const diff = new Date() - start;
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setTimer(`${h}:${m}:${s}`);
      }, 1000);
    } else {
      setTimer("00:00:00");
    }
    return () => clearInterval(interval);
  }, [data.activeRecord]);

  const handleAction = async () => {
    setLoading(true);
    try {
      const url = data.activeRecord ? "/attendance/checkout" : "/attendance/checkin";
      await api.post(url);
      toast.success(data.activeRecord ? "Checked out!" : "Checked in!");
      load();
    } catch (e) { 
      toast.error(e.response?.data?.message || "Failed"); 
    } finally {
      setLoading(false);
    }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-";
  const fmtTime = (d) => d ? new Date(d).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "-";

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-gray-500">Track your work hours and daily check-ins</p>
        </div>
        {data.activeRecord && (
          <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-center gap-4">
            <div className="bg-primary text-white p-2 rounded-lg animate-pulse">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-xs text-primary font-bold uppercase tracking-wider">Active Session</p>
              <p className="text-2xl font-mono font-bold text-primary">{timer}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-5 mb-8">
        <StatCard icon={Calendar} label="Days Present" value={data.daysPresent} />
        <StatCard icon={AlertCircle} label="Late Arrivals" value={data.lateArrivals} />
        <StatCard icon={Clock} label="Avg. Work Hrs" value={data.avgHours} suffix="Hrs" />
      </div>

      {isFetching ? <Loader /> : (
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <h2 className="font-semibold p-5 border-b">Recent Activity</h2>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-xs text-gray-500 uppercase">
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Check In</th>
              <th className="text-left p-4">Check Out</th>
              <th className="text-left p-4">Working Hours</th>
              <th className="text-left p-4">Day Type</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.records.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-4">{fmt(r.date)}</td>
                <td className="p-4">{fmtTime(r.checkIn)}</td>
                <td className="p-4">{fmtTime(r.checkOut)}</td>
                <td className="p-4">{Math.floor(r.workingHours)}h {Math.round((r.workingHours % 1) * 60)}m</td>
                <td className="p-4"><span className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-xs">{r.dayType}</span></td>
                <td className="p-4"><span className="px-3 py-1 bg-green-50 text-green-700 rounded text-xs">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}


      <button onClick={handleAction} disabled={loading}
        className={`fixed bottom-8 right-8 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 ${data.activeRecord ? 'bg-red-500' : 'bg-primary'} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}>
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (data.activeRecord ? <LogOut size={20} /> : <LogIn size={20} />)}

        <div className="text-left">
          <p className="font-semibold">{data.activeRecord ? 'Clock Out' : 'Clock In'}</p>
          <p className="text-xs opacity-80">{data.activeRecord ? 'finish your day' : 'start your work day'}</p>
        </div>
      </button>
    </div>
  );
}
