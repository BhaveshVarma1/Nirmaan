import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/auth";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0A0C0F] flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-[100px] animate-pulse" />
          <div className="absolute inset-0 bg-purple-500/20 blur-[100px] animate-pulse delay-300" />
          <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/30 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
              <span className="text-lg text-slate-300 font-medium">
                Authenticating...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
