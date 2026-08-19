import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// This is a client-side guard: it stops Field Staff from reaching these
// pages through the app's own navigation and gives a hard redirect if they
// somehow land on the URL directly. It is NOT a real security boundary —
// see README.md for what a production deployment needs instead (the data
// itself must be withheld by a server that checks the logged-in user's
// role, not just hidden by the interface).
export default function RequireSenior({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== "senior") return <Navigate to="/dashboard" replace />;
  return children;
}
