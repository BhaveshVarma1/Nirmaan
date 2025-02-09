import React, { useEffect, useState } from "react";
import { Quote, User, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import teachings from "@/data/teachings.json";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  title?: string;
  leftContent?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title = "Command Center",
  leftContent,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTeaching, setCurrentTeaching] = useState<{
    verse: string;
    chapter: string;
  } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const getRandomTeaching = () => {
      const randomIndex = Math.floor(Math.random() * teachings.quotes.length);
      const randomQuote = teachings.quotes[randomIndex];
      return { verse: randomQuote.text, chapter: randomQuote.author };
    };

    setCurrentTeaching(getRandomTeaching());
    const intervalId = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentTeaching(getRandomTeaching());
        setIsTransitioning(false);
      }, 500);
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="relative w-full backdrop-blur-3xl bg-black/20 border-b border-slate-800/50 px-6 py-4">
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="flex items-center justify-between gap-8">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          {leftContent}
          <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-400">
            {title}
          </h1>
        </div>

        {/* Center Section - Quote */}
        <div className="flex-1 flex justify-center">
          <div
            className={`flex flex-col items-center gap-2 text-slate-400 hover:text-slate-300 transition-all duration-1000 ${isTransitioning ? "opacity-0" : "opacity-100"} max-w-2xl mx-auto px-4`}
          >
            <div className="flex items-center gap-2">
              <Quote className="h-4 w-4 flex-shrink-0" />
              <p className="text-sm italic text-center">
                {currentTeaching?.verse}
              </p>
            </div>
            {currentTeaching?.chapter && (
              <p className="text-xs text-slate-500">
                {currentTeaching.chapter}
              </p>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-6">
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-xl overflow-hidden group/avatar"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover/avatar:opacity-100 transition-all duration-300" />
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
                    alt={user?.user_metadata?.full_name || user?.email}
                  />
                  <AvatarFallback>
                    {(user?.user_metadata?.full_name || user?.email || "")
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 mt-2 bg-slate-900/90 backdrop-blur-xl border-slate-700"
              align="end"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-slate-200">
                    {user?.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700/50" />
              <DropdownMenuItem className="text-slate-300 focus:text-white hover:bg-slate-800/50">
                <User className="mr-2 h-4 w-4" />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700/50" />
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-400 focus:text-red-300 hover:bg-red-500/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
