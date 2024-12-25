import React from "react";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  userName?: string;
  userAvatar?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0C0F] via-[#151821] to-[#0A0C0F] flex flex-col">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40vh] -left-[20vw] w-[80vw] h-[80vh] bg-blue-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[40vh] -right-[20vw] w-[80vw] h-[80vh] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[20vh] right-[10vw] w-[40vw] h-[40vh] bg-cyan-500/10 rounded-full blur-[100px] animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-screen">
        <DashboardHeader
          title="Dashboard"
          userAvatar={userAvatar}
          userName={userName}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          <main className="flex-1 overflow-auto backdrop-blur-3xl">
            <div className="h-full">
              <div className="container mx-auto p-6 space-y-6">{children}</div>
            </div>
          </main>
        </div>
      </div>

      {/* Glass Overlay */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default Layout;
