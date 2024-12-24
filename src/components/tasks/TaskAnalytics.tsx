import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Task, TaskAnalytics as TaskAnalyticsType, TaskCategory, TaskPriority, TaskStatus } from '@/types/task';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface TaskAnalyticsProps {
  tasks: Task[];
}

const COLORS = {
  blue: ['#60A5FA', '#3B82F6', '#2563EB'],
  purple: ['#C084FC', '#A855F7', '#7C3AED'],
  slate: ['#94A3B8', '#64748B', '#475569'],
};

const calculateAnalytics = (tasks: Task[]): TaskAnalyticsType => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  
  const totalTimeSpent = tasks.reduce((acc, task) => {
    if (task.actualTimeSpent) {
      return {
        hours: acc.hours + task.actualTimeSpent.hours,
        minutes: acc.minutes + task.actualTimeSpent.minutes,
      };
    }
    return acc;
  }, { hours: 0, minutes: 0 });

  // Normalize minutes
  totalTimeSpent.hours += Math.floor(totalTimeSpent.minutes / 60);
  totalTimeSpent.minutes = totalTimeSpent.minutes % 60;

  const averageTimeSpent = totalTasks ? {
    hours: Math.floor(totalTimeSpent.hours / totalTasks),
    minutes: Math.floor(totalTimeSpent.minutes / totalTasks),
  } : { hours: 0, minutes: 0 };

  const tasksByCategory = Object.values(TaskCategory).reduce((acc, category) => {
    acc[category] = tasks.filter(t => t.category === category).length;
    return acc;
  }, {} as Record<TaskCategory, number>);

  const tasksByPriority = Object.values(TaskPriority).reduce((acc, priority) => {
    acc[priority] = tasks.filter(t => t.priority === priority).length;
    return acc;
  }, {} as Record<TaskPriority, number>);

  const tasksByStatus = Object.values(TaskStatus).reduce((acc, status) => {
    acc[status] = tasks.filter(t => t.status === status).length;
    return acc;
  }, {} as Record<TaskStatus, number>);

  const urgentImportantMatrix = {
    urgentImportant: tasks.filter(t => t.urgency && t.importance).length,
    urgentNotImportant: tasks.filter(t => t.urgency && !t.importance).length,
    notUrgentImportant: tasks.filter(t => !t.urgency && t.importance).length,
    notUrgentNotImportant: tasks.filter(t => !t.urgency && !t.importance).length,
  };

  return {
    totalTasks,
    completedTasks,
    completionRate: totalTasks ? (completedTasks / totalTasks) * 100 : 0,
    averageTimeSpent,
    tasksByCategory,
    tasksByPriority,
    tasksByStatus,
    urgentImportantMatrix,
  };
};

const TaskAnalytics: React.FC<TaskAnalyticsProps> = React.memo(({ tasks }) => {
  const analytics = React.useMemo(() => calculateAnalytics(tasks), [tasks]);

  const categoryData = React.useMemo(() => 
    Object.entries(analytics.tasksByCategory).map(([name, value]) => ({
      name,
      value,
    })),
    [analytics.tasksByCategory]
  );

  const priorityData = React.useMemo(() => 
    Object.entries(analytics.tasksByPriority).map(([name, value]) => ({
      name,
      value,
    })),
    [analytics.tasksByPriority]
  );

  const matrixData = React.useMemo(() => [
    { name: 'Urgent & Important', value: analytics.urgentImportantMatrix.urgentImportant },
    { name: 'Urgent & Not Important', value: analytics.urgentImportantMatrix.urgentNotImportant },
    { name: 'Not Urgent & Important', value: analytics.urgentImportantMatrix.notUrgentImportant },
    { name: 'Not Urgent & Not Important', value: analytics.urgentImportantMatrix.notUrgentNotImportant },
  ], [analytics.urgentImportantMatrix]);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400">Total Tasks</h3>
              <p className="text-2xl font-bold text-white">{analytics.totalTasks}</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400">Completion Rate</h3>
              <p className="text-2xl font-bold text-white">
                {analytics.completionRate.toFixed(1)}%
              </p>
              <Progress value={analytics.completionRate} className="h-2" />
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400">Average Time</h3>
              <p className="text-2xl font-bold text-white">
                {analytics.averageTimeSpent.hours}h {analytics.averageTimeSpent.minutes}m
              </p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400">Active Tasks</h3>
              <p className="text-2xl font-bold text-white">
                {analytics.totalTasks - analytics.completedTasks}
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-4 bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <h3 className="text-lg font-medium text-white mb-4">Categories Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.blue[index % COLORS.blue.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Priority Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-4 bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <h3 className="text-lg font-medium text-white mb-4">Priority Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {priorityData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.purple[index % COLORS.purple.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Eisenhower Matrix Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7 }}
          className="md:col-span-2"
        >
          <Card className="p-4 bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
            <h3 className="text-lg font-medium text-white mb-4">Task Matrix Distribution</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={matrixData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {matrixData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS.slate[index % COLORS.slate.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
});

TaskAnalytics.displayName = 'TaskAnalytics';

export default TaskAnalytics; 