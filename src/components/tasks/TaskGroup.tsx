import React from 'react';
import { TaskGroup as ITaskGroup, TaskPriority } from '@/types/task';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronRight,
  Clock,
  MoreVertical,
  Trash2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskGroupProps {
  group: ITaskGroup;
  expanded: boolean;
  onToggle: () => void;
  onTaskToggle: (taskId: string) => void;
  onDeleteGroup: () => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskGroup: React.FC<TaskGroupProps> = ({
  group,
  expanded,
  onToggle,
  onTaskToggle,
  onDeleteGroup,
  onDeleteTask,
}) => {
  const getPriorityColor = React.useCallback((priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.High:
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case TaskPriority.Medium:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case TaskPriority.Low:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  }, []);

  const sortedTasks = React.useMemo(() => {
    return [...group.tasks].sort((a, b) => {
      // Sort by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then by priority
      if (a.priority !== b.priority) {
        const priorityOrder = {
          [TaskPriority.High]: 0,
          [TaskPriority.Medium]: 1,
          [TaskPriority.Low]: 2,
        };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      // Then by urgency and importance
      if (a.urgency !== b.urgency) {
        return a.urgency ? -1 : 1;
      }
      if (a.importance !== b.importance) {
        return a.importance ? -1 : 1;
      }
      // Finally by date and time
      return new Date(a.date + ' ' + (a.time || '')).getTime() -
        new Date(b.date + ' ' + (b.time || '')).getTime();
    });
  }, [group.tasks]);

  return (
    <motion.div
      layout
      className="rounded-2xl bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 text-slate-200 hover:text-white transition-colors"
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <h3 className="font-medium">{group.title}</h3>
          <span className="text-sm text-slate-400">({group.tasks.length})</span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-100"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={onDeleteGroup}
              className="text-red-400 focus:text-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Group
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tasks */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-slate-700/50"
          >
            <div className="p-2 space-y-2">
              <AnimatePresence initial={false} mode="popLayout">
                {sortedTasks.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      'group relative rounded-xl border transition-colors',
                      task.completed
                        ? 'bg-slate-800/30 border-slate-700/30'
                        : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70'
                    )}
                  >
                    {/* Task Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4
                              className={cn(
                                'font-medium transition-colors',
                                task.completed
                                  ? 'text-slate-400 line-through'
                                  : 'text-slate-200'
                              )}
                            >
                              {task.title}
                            </h4>
                            {task.urgency && task.importance && (
                              <span className="px-1.5 py-0.5 text-[10px] font-medium rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/20">
                                Critical
                              </span>
                            )}
                          </div>
                          <p
                            className={cn(
                              'text-sm transition-colors',
                              task.completed ? 'text-slate-500' : 'text-slate-400'
                            )}
                          >
                            {task.description}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Priority Badge */}
                          <span
                            className={cn(
                              'px-2 py-1 text-xs rounded-lg border',
                              getPriorityColor(task.priority)
                            )}
                          >
                            {task.priority}
                          </span>

                          {/* Time Badge */}
                          {task.time && (
                            <div className="flex items-center gap-1 px-2 py-1 text-xs rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              <Clock className="h-3 w-3" />
                              {task.time}
                            </div>
                          )}

                          {/* Delete Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDeleteTask(task.id)}
                            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Task Actions */}
                      <div className="mt-4 flex items-center gap-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onTaskToggle(task.id)}
                          className={cn(
                            'h-7 px-2 text-xs',
                            task.completed
                              ? 'text-green-400 hover:text-green-400'
                              : 'text-slate-400 hover:text-slate-100'
                          )}
                        >
                          {task.completed ? 'Completed' : 'Mark Complete'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(TaskGroup);
