import React from 'react';
import { Task, TaskPriority } from '@/types/task';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import {
  Clock,
  Flag,
  AlertTriangle,
  Target,
  Timer,
  Link,
  Repeat,
  CheckCircle2,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.High:
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case TaskPriority.Medium:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case TaskPriority.Low:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        'group relative p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm transition-colors cursor-pointer hover:bg-slate-800/50',
        task.completed && 'opacity-60'
      )}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            'text-lg font-medium text-slate-200 truncate',
            task.completed && 'line-through text-slate-400'
          )}>
            {task.title}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Priority Badge */}
          <span className={cn(
            'px-2 py-1 text-xs rounded-lg border',
            getPriorityColor(task.priority)
          )}>
            <Flag className="h-3 w-3" />
          </span>

          {/* Urgency & Importance */}
          {task.urgency && (
            <span className="px-2 py-1 text-xs rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
              <AlertTriangle className="h-3 w-3" />
            </span>
          )}
          {task.importance && (
            <span className="px-2 py-1 text-xs rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Target className="h-3 w-3" />
            </span>
          )}
        </div>
      </div>

      {/* Task Description */}
      {task.description && (
        <p className="text-slate-400 text-sm line-clamp-2 mt-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Task Metadata */}
      <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
        {/* Time */}
        {task.time && (
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="h-4 w-4" />
            <span>{task.time}</span>
          </div>
        )}

        {/* Duration */}
        {task.duration && (task.duration.hours > 0 || task.duration.minutes > 0) && (
          <div className="flex items-center gap-1 text-slate-400">
            <Timer className="h-4 w-4" />
            <span>
              {task.duration.hours > 0 && `${task.duration.hours}h`}
              {task.duration.minutes > 0 && ` ${task.duration.minutes}m`}
            </span>
          </div>
        )}

        {/* Dependencies */}
        {task.dependencies && task.dependencies.length > 0 && (
          <div className="flex items-center gap-1 text-slate-400">
            <Link className="h-4 w-4" />
            <span>{task.dependencies.length} dep{task.dependencies.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Recurrence */}
        {task.recurrence && (
          <div className="flex items-center gap-1 text-slate-400">
            <Repeat className="h-4 w-4" />
            <span>
              {task.recurrence.interval > 1 ? task.recurrence.interval : ''} 
              {task.recurrence.type.toLowerCase()}
            </span>
          </div>
        )}
      </div>

      {/* Dependencies List */}
      {task.dependencies && task.dependencies.length > 0 && (
        <div className="mt-3 space-y-1">
          <p className="text-xs text-slate-500">Dependencies:</p>
          <div className="flex flex-wrap gap-2">
            {task.dependencies.map((dep) => (
              <span
                key={dep.id}
                className={cn(
                  "px-2 py-0.5 text-xs rounded-full flex items-center gap-1",
                  dep.completed
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                )}
              >
                {dep.completed && <CheckCircle2 className="h-3 w-3" />}
                {dep.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default TaskCard; 