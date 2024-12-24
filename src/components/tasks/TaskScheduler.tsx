import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus } from 'lucide-react';
import { Task, TaskPriority } from '@/types/task';
import useTaskStore from '@/lib/store/taskStore';
import { format } from 'date-fns';
import AddTaskDialog from './AddTaskDialog';
import { cn } from '@/lib/utils';

const TaskScheduler = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const tasks = useTaskStore((state) => state.groups.flatMap((group) => group.tasks));

  // Group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    const date = task.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  // Get unique dates and sort them
  const dates = Object.keys(tasksByDate).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.High:
        return 'bg-red-500/20 text-red-400';
      case TaskPriority.Medium:
        return 'bg-yellow-500/20 text-yellow-400';
      case TaskPriority.Low:
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-200">Task Schedule</h2>
        <Button onClick={() => setShowAddTask(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      <div className="grid gap-6">
        {dates.map((date) => (
          <div key={date} className="space-y-4">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="h-4 w-4" />
              <h3 className="font-medium">{format(new Date(date), 'EEEE, MMMM d')}</h3>
            </div>

            <div className="grid gap-3">
              {tasksByDate[date].map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium text-slate-200">{task.title}</h4>
                    <p className="text-sm text-slate-400">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{task.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'px-2 py-1 text-xs rounded-lg',
                          getPriorityColor(task.priority)
                        )}
                      >
                        {task.priority}
                      </span>
                      <span
                        className="px-2 py-1 text-xs rounded-lg bg-blue-500/20 text-blue-400"
                      >
                        {task.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showAddTask && <AddTaskDialog onClose={() => setShowAddTask(false)} />}
    </div>
  );
};

export default TaskScheduler; 