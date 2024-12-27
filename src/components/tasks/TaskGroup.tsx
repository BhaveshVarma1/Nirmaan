import React from 'react';
import { Task, TaskGroup } from '@/types/task';
import TaskCard from './TaskCard';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TaskGroupProps {
  group: TaskGroup;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleTask: (taskId: string) => void;
  onDeleteGroup: () => void;
  onTaskClick: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

const TaskGroupComponent: React.FC<TaskGroupProps> = ({
  group,
  expanded,
  onToggleExpand,
  onToggleTask,
  onDeleteGroup,
  onTaskClick,
  onDeleteTask,
}) => {
  const handleTaskClick = (task: Task) => {
    onToggleTask(task.id);
    onTaskClick(task);
  };

  return (
    <div className="relative group">
      <div className="relative p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
        {/* Group Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors"
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform",
                expanded ? "transform rotate-180" : ""
              )}
            />
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-medium">
                {group.title}
              </h3>
              <span className="text-sm text-slate-400">
                {format(new Date(group.date), 'MMM d, yyyy')}
              </span>
            </div>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">
              {group.tasks.length} task{group.tasks.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={onDeleteGroup}
              className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <Trash className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 space-y-3 overflow-hidden"
            >
              {group.tasks.map((task) => (
                <div key={task.id} className="group/task relative">
                  <TaskCard
                    task={task}
                    onClick={() => handleTaskClick(task)}
                  />
                  {onDeleteTask && (
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="absolute right-2 top-2 p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover/task:opacity-100"
                    >
                      <Trash className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskGroupComponent;
