import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import type { UserRole } from "@/types";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { profile, loading, initialized } = useAuthStore();

  if (!initialized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
