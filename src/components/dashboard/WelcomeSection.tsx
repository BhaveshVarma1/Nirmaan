import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Circle,
  Target,
  TrendingUp,
  Clock,
  Calendar,
} from "lucide-react";

interface WelcomeSectionProps {
  userName?: string;
  totalTasks?: number;
  completedTasks?: number;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  userName = "innovator",
  totalTasks = 12,
  completedTasks = 5,
}) => {
  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Welcome Message & Quick Stats */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Welcome back, {userName}!
          </h1>
          <p className="text-slate-400">
            Track your progress and achieve your goals
          </p>
        </div>
        <Card className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 text-white w-full md:w-auto">
          <div className="flex items-center gap-4">
            <TrendingUp className="h-8 w-8" />
            <div>
              <p className="text-sm font-medium">Weekly Progress</p>
              <p className="text-2xl font-bold">+27%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks Card */}
        <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Total Tasks</p>
              <p className="text-3xl font-bold">{totalTasks}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Circle className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <Clock className="h-4 w-4" />
            <span>Updated just now</span>
          </div>
        </Card>

        {/* Completed Tasks Card */}
        <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Completed Tasks</p>
              <p className="text-3xl font-bold">{completedTasks}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-green-500">
            <TrendingUp className="h-4 w-4" />
            <span>+12% from last week</span>
          </div>
        </Card>

        {/* Completion Rate Card */}
        <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Completion Rate</p>
              <p className="text-3xl font-bold">{completionPercentage}%</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Target className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <Progress value={completionPercentage} className="mt-4" />
        </Card>

        {/* Upcoming Tasks Card */}
        <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white hover:scale-[1.02] transition-transform cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-slate-400">Upcoming Tasks</p>
              <p className="text-3xl font-bold">
                {totalTasks - completedTasks}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-orange-500">
            <Clock className="h-4 w-4" />
            <span>Due this week</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WelcomeSection;
