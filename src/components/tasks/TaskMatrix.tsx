import React from 'react';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Target, Clock, Coffee } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskMatrixProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

interface QuadrantProps {
  title: string;
  description: string;
  tasks: Task[];
  icon: React.ReactNode;
  className?: string;
  onTaskClick: (task: Task) => void;
}

const Quadrant: React.FC<QuadrantProps> = React.memo(({
  title,
  description,
  tasks,
  icon,
  className,
  onTaskClick,
}) => (
  <Card className={cn(
    "p-4 space-y-4 bg-slate-900/50 border-slate-700/50 backdrop-blur-xl",
    "transition-all duration-300 hover:bg-slate-800/70",
    className
  )}>
    <div className="flex items-center gap-2 border-b border-slate-700/50 pb-2">
      <div className="p-2 rounded-lg bg-slate-800/50">{icon}</div>
      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
    <div className="space-y-2">
      <AnimatePresence initial={false} mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => onTaskClick(task)}
            className={cn(
              "p-3 rounded-lg bg-slate-800/30 border border-slate-700/30",
              "hover:bg-slate-700/30 cursor-pointer transition-colors",
              "group relative overflow-hidden"
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white">{task.title}</span>
                <Badge variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'default' : 'secondary'}>
                  {task.priority}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>{task.category}</span>
                {task.duration && (
                  <span>• {task.duration.hours}h {task.duration.minutes}m</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-4 text-slate-500 text-sm"
        >
          No tasks in this quadrant
        </motion.div>
      )}
    </div>
  </Card>
));

const TaskMatrix: React.FC<TaskMatrixProps> = React.memo(({ tasks, onTaskClick }) => {
  const urgentImportant = React.useMemo(() => 
    tasks.filter(t => t.urgency && t.importance),
    [tasks]
  );
  
  const urgentNotImportant = React.useMemo(() => 
    tasks.filter(t => t.urgency && !t.importance),
    [tasks]
  );
  
  const notUrgentImportant = React.useMemo(() => 
    tasks.filter(t => !t.urgency && t.importance),
    [tasks]
  );
  
  const notUrgentNotImportant = React.useMemo(() => 
    tasks.filter(t => !t.urgency && !t.importance),
    [tasks]
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <Quadrant
        title="Do First"
        description="Urgent and Important"
        tasks={urgentImportant}
        icon={<AlertTriangle className="h-5 w-5 text-red-400" />}
        className="border-l-4 border-l-red-500/50"
        onTaskClick={onTaskClick}
      />
      <Quadrant
        title="Schedule"
        description="Important, Not Urgent"
        tasks={notUrgentImportant}
        icon={<Target className="h-5 w-5 text-blue-400" />}
        className="border-l-4 border-l-blue-500/50"
        onTaskClick={onTaskClick}
      />
      <Quadrant
        title="Delegate"
        description="Urgent, Not Important"
        tasks={urgentNotImportant}
        icon={<Clock className="h-5 w-5 text-yellow-400" />}
        className="border-l-4 border-l-yellow-500/50"
        onTaskClick={onTaskClick}
      />
      <Quadrant
        title="Don't Do"
        description="Not Urgent or Important"
        tasks={notUrgentNotImportant}
        icon={<Coffee className="h-5 w-5 text-slate-400" />}
        className="border-l-4 border-l-slate-500/50"
        onTaskClick={onTaskClick}
      />
    </div>
  );
});

Quadrant.displayName = 'Quadrant';
TaskMatrix.displayName = 'TaskMatrix';

export default TaskMatrix; 