import React from 'react';
import { Task } from '@/types/task';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  Flag,
  AlertTriangle,
  Target,
  Tags,
  Timer,
  Repeat,
  Link,
  Edit2,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import useTaskStore from '@/lib/store/taskStore';

interface ViewTaskDialogProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ViewTaskDialog: React.FC<ViewTaskDialogProps> = ({
  task,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}) => {
  const tasks = useTaskStore((state) => state.groups.flatMap((group) => group.tasks));

  const getDependencyTasks = () => {
    if (!task.dependencies?.length) return [];
    return task.dependencies.map(dep => {
      const dependentTask = tasks.find(t => t.id === dep.taskId);
      return {
        ...dep,
        task: dependentTask,
      };
    }).filter(dep => dep.task);
  };

  const dependencies = getDependencyTasks();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{task.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-slate-400">Description</h3>
            <p className="text-white whitespace-pre-wrap">{task.description}</p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Category & Priority */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-400">Category & Priority</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-slate-700/30">
                    <Tags className="h-3 w-3 mr-1" />
                    {task.category}
                  </Badge>
                  <Badge variant="outline" className={cn(
                    task.priority === 'High' && 'bg-red-500/10 text-red-500 border-red-500/20',
                    task.priority === 'Medium' && 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
                    task.priority === 'Low' && 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  )}>
                    <Flag className="h-3 w-3 mr-1" />
                    {task.priority}
                  </Badge>
                </div>
              </div>

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-400">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-slate-700/30 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Dependencies */}
              {dependencies.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-400">Dependencies</h3>
                  <div className="flex flex-col gap-2">
                    {dependencies.map(({ taskId, type, task: depTask }) => (
                      <Badge
                        key={taskId}
                        variant="outline"
                        className="bg-slate-700/30 text-xs flex items-center gap-1 w-fit"
                      >
                        <Link className="h-3 w-3" />
                        {type}: {depTask?.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Date & Time */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-400">Schedule</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(task.date), 'MMMM d, yyyy')}
                  </div>
                  {task.time && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      {task.time}
                    </div>
                  )}
                  {task.duration && (task.duration.hours > 0 || task.duration.minutes > 0) && (
                    <div className="flex items-center gap-2 text-sm">
                      <Timer className="h-4 w-4" />
                      {task.duration.hours > 0 && `${task.duration.hours} hours`}{' '}
                      {task.duration.minutes > 0 && `${task.duration.minutes} minutes`}
                    </div>
                  )}
                </div>
              </div>

              {/* Recurrence */}
              {task.recurrence && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-slate-400">Recurrence</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <Repeat className="h-4 w-4" />
                    <span>
                      Repeats {task.recurrence.pattern.toLowerCase()}
                      {task.recurrence.interval > 1 && ` every ${task.recurrence.interval} ${task.recurrence.pattern.toLowerCase()}`}
                      {task.recurrence.daysOfWeek && task.recurrence.daysOfWeek.length > 0 && (
                        <> on {task.recurrence.daysOfWeek.map(day => 
                          ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
                        ).join(', ')}</>
                      )}
                    </span>
                  </div>
                </div>
              )}

              {/* Urgency & Importance */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-slate-400">Priority Matrix</h3>
                <div className="flex gap-3">
                  {task.urgency && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm">Urgent</span>
                    </div>
                  )}
                  {task.importance && (
                    <div className="flex items-center gap-1 text-blue-400">
                      <Target className="h-4 w-4" />
                      <span className="text-sm">Important</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            {onEdit && (
              <Button
                variant="outline"
                onClick={onEdit}
                className="flex items-center gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                onClick={onDelete}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTaskDialog; 