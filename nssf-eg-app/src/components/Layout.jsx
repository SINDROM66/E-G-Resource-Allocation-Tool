import { Outlet, useLocation, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const TITLES = {
  "/dashboard": "Dashboard",
  "/partners": "Partner Registry & Pipeline",
  "/plan": "Plan an Outreach",
  "/schedule": "Deployment Schedule",
  "/perdiem": "Per Diem",
  "/results": "Results & Insights",
  "/users": "Manage Users",
};

export default function Layout() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  if (!currentUser) return <Navigate to="/login" replace />;

  const title = TITLES[location.pathname] || "";

  return (
    <div className="shell">
      <Sidebar role={currentUser.role} />
      <div className="main">
        <div className="topbar">
          <div className="title">{title}</div>
          <div className="user-menu">
            <div className="who">
              <strong>{currentUser.name}</strong>
              <span>{currentUser.title}</span>
            </div>
            <button className="logout-btn" onClick={logout}>Sign out</button>
          </div>
        </div>
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
