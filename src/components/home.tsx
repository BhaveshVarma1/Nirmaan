import React, { useState, useEffect } from "react";
import DashboardHeader from "./layout/DashboardHeader";
import Sidebar from "./layout/Sidebar";
import WelcomeSection from "./dashboard/WelcomeSection";
import TaskBoard from "./tasks/TaskBoard";
import { AnimatePresence, motion } from "framer-motion";

interface HomeProps {
  userName?: string;
  userAvatar?: string;
  quote?: string;
  activeNavItem?: string;
  onNavItemClick?: (href: string) => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
}

const Home: React.FC<HomeProps> = ({
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
  quote = "Knowledge without creation is just a psychic iteration",
  activeNavItem = "/dashboard",
  onNavItemClick = () => {},
  onProfileClick = () => {},
  onLogout = () => {},
}) => {
  const [mounted, setMounted] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(256); // Default width

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle sidebar resize
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX;
        if (newWidth >= 200 && newWidth <= 400) {
          setSidebarWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0A0C0F] flex flex-col relative overflow-hidden"
    >
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-[40vh] -left-[20vw] w-[80vw] h-[80vh] bg-blue-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            delay: 5,
          }}
          className="absolute -bottom-[40vh] -right-[20vw] w-[80vw] h-[80vh] bg-purple-500/10 rounded-full blur-[120px]"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key="header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <DashboardHeader
              title="NirmaanVerse"
              quote={quote}
              userAvatar={userAvatar}
              userName={userName}
              onProfileClick={onProfileClick}
              onLogout={onLogout}
            />
          </motion.div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar with resize handle */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ width: sidebarWidth }}
              className="relative"
            >
              <Sidebar
                activeItem={activeNavItem}
                onNavItemClick={onNavItemClick}
              />
              <div
                className={`absolute right-0 top-0 bottom-0 w-1 cursor-col-resize
                  hover:bg-blue-500/20 active:bg-blue-500/40 transition-colors
                  ${isResizing ? "bg-blue-500/40" : ""}`}
                onMouseDown={handleMouseDown}
              />
            </motion.div>

            {/* Main Content Area */}
            <motion.main
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex-1 overflow-auto backdrop-blur-xl"
            >
              <div className="container mx-auto p-6 space-y-6">
                <WelcomeSection
                  userName={userName}
                  totalTasks={12}
                  completedTasks={5}
                />
                <TaskBoard />
              </div>
            </motion.main>
          </div>
        </AnimatePresence>
      </div>

      {/* Glass Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none" />

      {/* Radial Gradient for Active Area */}
      <div className="fixed inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-blue-500/0 mix-blend-overlay pointer-events-none" />
    </motion.div>
  );
};

export default Home;
