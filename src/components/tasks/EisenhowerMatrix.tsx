import React from 'react';
import { Task } from '@/types/task';
import { motion, AnimatePresence } from 'framer-motion';
import TaskCard from './TaskCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EisenhowerMatrixProps {
  tasks: Task[];
}

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ tasks }) => {
  const quadrants = {
    urgentImportant: tasks.filter((task) => task.urgency && task.importance),
    urgentNotImportant: tasks.filter((task) => task.urgency && !task.importance),
    notUrgentImportant: tasks.filter((task) => !task.urgency && task.importance),
    notUrgentNotImportant: tasks.filter((task) => !task.urgency && !task.importance),
  };

  const QuadrantSection = ({ title, tasks, className }: { title: string; tasks: Task[]; className?: string }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`p-4 rounded-lg border border-slate-700/50 ${className}`}
    >
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <ScrollArea className="h-[300px]">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <TaskCard task={task} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </motion.div>
  );

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <QuadrantSection
        title="Do First (Urgent & Important)"
        tasks={quadrants.urgentImportant}
        className="bg-red-500/10"
      />
      <QuadrantSection
        title="Schedule (Not Urgent but Important)"
        tasks={quadrants.notUrgentImportant}
        className="bg-blue-500/10"
      />
      <QuadrantSection
        title="Delegate (Urgent but Not Important)"
        tasks={quadrants.urgentNotImportant}
        className="bg-yellow-500/10"
      />
      <QuadrantSection
        title="Don't Do (Not Urgent & Not Important)"
        tasks={quadrants.notUrgentNotImportant}
        className="bg-green-500/10"
      />
    </div>
  );
};

export default EisenhowerMatrix; 