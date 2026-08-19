import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import Layout from "./components/Layout";
import RequireSenior from "./components/RequireSenior";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Partners from "./pages/Partners";
import PlanOutreach from "./pages/PlanOutreach";
import Schedule from "./pages/Schedule";
import PerDiem from "./pages/PerDiem";
import Results from "./pages/Results";
import Personalisation from "./pages/Personalisation";
import ManageUsers from "./pages/ManageUsers";

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="partners" element={<Partners />} />
            <Route path="plan" element={<RequireSenior><PlanOutreach /></RequireSenior>} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="perdiem" element={<RequireSenior><PerDiem /></RequireSenior>} />
            <Route path="results" element={<Results />} />
            <Route path="personalisation" element={<Personalisation />} />
            <Route path="users" element={<RequireSenior><ManageUsers /></RequireSenior>} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DataProvider>
    </AuthProvider>
  );
}
