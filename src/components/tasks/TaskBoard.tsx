import React from "react";
import { Task, TaskCategory } from "@/types/task";
import TaskGroupComponent from "./TaskGroup";
import AddTaskDialog from "./AddTaskDialog";
import TaskMatrix from "./TaskMatrix";
import TaskAnalytics from "./TaskAnalytics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ListTodo,
  CheckCircle2,
  Target,
  BarChart3,
  LayoutGrid,
  Sparkles,
  Brain,
  Flame,
  Trophy,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import useTaskStore from "@/lib/store/taskStore";
import { motion, AnimatePresence } from "framer-motion";

type ViewType = "list" | "matrix" | "analytics" | "growth";

interface TaskBoardProps {
  allTasks: Task[];
  handleTaskClick: (task: Task) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ allTasks, handleTaskClick }) => {
  const [view, setView] = React.useState<ViewType>("list");
  const { groups, expandedGroups, toggleGroup, toggleTask, deleteGroup, deleteTask } = useTaskStore();
  const [showMotivation, setShowMotivation] = React.useState(false);

  const getTotalTasks = () => allTasks.length;
  const getCompletedTasks = () => allTasks.filter((task) => task.completed).length;
  const getCompletionPercentage = () => {
    const total = getTotalTasks();
    return total > 0 ? Math.round((getCompletedTasks() / total) * 100) : 0;
  };

  // Calculate streak and momentum
  const streak = React.useMemo(() => {
    let currentStreak = 0;
    const today = new Date();
    const sortedTasks = [...allTasks].sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    for (const task of sortedTasks) {
      const taskDate = new Date(task.updatedAt);
      if (taskDate.toDateString() === today.toDateString() && task.completed) {
        currentStreak++;
      } else {
        break;
      }
    }
    return currentStreak;
  }, [allTasks]);

  const onTaskClick = React.useCallback((task: Task) => {
    handleTaskClick(task);
    if (!task.completed) {
      setShowMotivation(true);
      setTimeout(() => setShowMotivation(false), 3000);
    }
  }, [handleTaskClick]);

  const getMotivationalMessage = () => {
    const messages = [
      "Incredible progress! You're building momentum! 🚀",
      "Every task completed is a step toward greatness! ⭐",
      "You're unstoppable! Keep going! 💪",
      "Building excellence, one task at a time! 🏆",
      "Your future self will thank you! 🌟"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const handleViewChange = React.useCallback((newView: string) => {
    setView(newView as ViewType);
  }, []);

  return (
    <div className="w-full h-full space-y-8">
      {/* Floating Motivation Message */}
      <AnimatePresence>
        {showMotivation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-8 right-8 p-4 rounded-2xl bg-gradient-to-r from-blue-600/90 to-purple-600/90 text-white shadow-xl backdrop-blur-xl z-50"
          >
            {getMotivationalMessage()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section with Advanced Glassmorphism */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 backdrop-blur-2xl border border-slate-700/30 shadow-2xl">
        {/* Dynamic Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-blue-500/10 animate-gradient" />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1] 
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="absolute -left-32 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1] 
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
            className="absolute -right-32 bottom-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" 
          />
        </div>

        {/* Content */}
        <div className="relative p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left Section - Title & Streak */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl group-hover:bg-blue-500/30"
                />
                <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/20">
                  <ListTodo className="h-7 w-7 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                  Personal Growth Hub
                </h2>
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-400" />
                  <p className="text-orange-400">
                    {streak} task streak today!
                  </p>
                </div>
              </div>
            </div>

            {/* Right Section - Add Task Button */}
            <AddTaskDialog
              onClose={() => {}}
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Total Tasks */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl transition-all duration-300 hover:bg-slate-800/70"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Total Tasks</p>
                  <p className="text-2xl font-bold text-white">
                    {getTotalTasks()}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-slate-700/50 flex items-center justify-center">
                  <ListTodo className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </motion.div>

            {/* Completed Tasks */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl transition-all duration-300 hover:bg-slate-800/70"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Completed</p>
                  <p className="text-2xl font-bold text-white">
                    {getCompletedTasks()}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-slate-700/50 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </motion.div>

            {/* Growth Score */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl transition-all duration-300 hover:bg-slate-800/70"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Growth Score</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-white">
                      {Math.min(streak * 10 + getCompletedTasks() * 5, 100)}
                    </p>
                    <Sparkles className="h-5 w-5 text-yellow-400" />
                  </div>
                </div>
                <div className="h-12 w-12 rounded-xl bg-slate-700/50 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </motion.div>

            {/* Completion Rate */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative group p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl transition-all duration-300 hover:bg-slate-800/70"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="space-y-1">
                  <p className="text-sm text-slate-400">Success Rate</p>
                  <p className="text-2xl font-bold text-white">
                    {getCompletionPercentage()}%
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-slate-700/50 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-orange-400" />
                </div>
              </div>
              <Progress 
                value={getCompletionPercentage()} 
                className="h-2 bg-slate-700/50"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* View Selector */}
      <Tabs 
        value={view} 
        onValueChange={handleViewChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4 bg-slate-900/50 border border-slate-700/30">
          <TabsTrigger value="list" className="data-[state=active]:bg-slate-800">
            <LayoutGrid className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="matrix" className="data-[state=active]:bg-slate-800">
            <Target className="h-4 w-4 mr-2" />
            Matrix
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-800">
            <BarChart3 className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="growth" className="data-[state=active]:bg-slate-800">
            <Sparkles className="h-4 w-4 mr-2" />
            Growth
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="space-y-6">
            <AnimatePresence>
              {groups.map((group) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <TaskGroupComponent
                    group={group}
                    expanded={expandedGroups[group.id]}
                    onToggle={() => toggleGroup(group.id)}
                    onTaskToggle={(taskId) => toggleTask(group.id, taskId)}
                    onDeleteGroup={() => deleteGroup(group.id)}
                    onDeleteTask={(taskId) => deleteTask(group.id, taskId)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {groups.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/50 mb-4">
                  <ListTodo className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-300 mb-2">
                  Start Your Growth Journey
                </h3>
                <p className="text-slate-400">
                  Create your first task to begin your transformation
                </p>
              </motion.div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="matrix" className="mt-6">
          <TaskMatrix tasks={allTasks} onTaskClick={onTaskClick} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <TaskAnalytics tasks={allTasks} />
        </TabsContent>

        <TabsContent value="growth" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Growth Journey Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-slate-700/30 backdrop-blur-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-blue-500/20">
                  <Trophy className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Growth Journey</h3>
                  <p className="text-sm text-slate-400">Track your progress</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Daily Streak</span>
                  <span className="text-white font-semibold">{streak} days</span>
                </div>
                <Progress 
                  value={Math.min(streak * 10, 100)} 
                  className="h-2"
                />
                <p className="text-sm text-slate-400">
                  {streak < 3 ? "Building momentum!" : streak < 7 ? "You're on fire!" : "Unstoppable!"}
                </p>
              </div>
            </motion.div>

            {/* Focus Areas Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-slate-700/30 backdrop-blur-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-purple-500/20">
                  <Target className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Focus Areas</h3>
                  <p className="text-sm text-slate-400">Your growth categories</p>
                </div>
              </div>
              <div className="space-y-3">
                {Object.values(TaskCategory).map((category) => {
                  const count = allTasks.filter(t => t.category === category).length;
                  return (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-slate-400">{category}</span>
                      <span className="text-white font-semibold">{count} tasks</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Achievement Stats Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-orange-600/10 to-red-600/10 border border-slate-700/30 backdrop-blur-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-xl bg-orange-500/20">
                  <Sparkles className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Achievements</h3>
                  <p className="text-sm text-slate-400">Your milestones</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Tasks Completed</span>
                  <span className="text-white font-semibold">{getCompletedTasks()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Success Rate</span>
                  <span className="text-white font-semibold">{getCompletionPercentage()}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Growth Score</span>
                  <span className="text-white font-semibold">{Math.min(streak * 10 + getCompletedTasks() * 5, 100)}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TaskBoard;
