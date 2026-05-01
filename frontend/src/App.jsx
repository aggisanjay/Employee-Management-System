import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import PortalSelect from "./pages/PortalSelect";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Payslips from "./pages/Payslips";
import PayslipPrint from "./pages/PayslipPrint";
import Settings from "./pages/Settings";

import Loader from "./components/Loader";

const PrivateRoute = ({ children, adminOnly }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader fullPage />;
  if (!user) return <Navigate to="/" replace />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" replace />;
  return children;
};


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<PortalSelect />} />
          <Route path="/login/:portal" element={<Login />} />
          <Route path="/payslip/:id" element={<PrivateRoute><PayslipPrint /></PrivateRoute>} />

          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<PrivateRoute adminOnly><Employees /></PrivateRoute>} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/leave" element={<Leave />} />
            <Route path="/payslips" element={<Payslips />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
