import React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import {
  Task,
  TaskCategory,
  TaskPriority,
  TaskStatus,
  TaskDuration,
  TaskRecurrenceType,
  TaskRecurrence,
  TaskDependency
} from '@/types/task';
import { cn } from '@/lib/utils';
import useTaskStore from '@/lib/store/taskStore';
import {
  Calendar,
  Clock,
  Flag,
  AlertTriangle,
  Target,
  Tags,
  Timer,
  X,
  Repeat,
  Link
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from '@/components/ui/scroll-area';

interface AddTaskDialogProps {
  trigger?: React.ReactNode;
  onClose: () => void;
}

const AddTaskDialog: React.FC<AddTaskDialogProps> = ({ trigger, onClose }) => {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState<TaskCategory>(TaskCategory.Work);
  const [priority, setPriority] = React.useState<TaskPriority>(TaskPriority.Medium);
  const [date, setDate] = React.useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = React.useState('');
  const [duration, setDuration] = React.useState<TaskDuration>({ hours: 0, minutes: 0 });
  const [urgency, setUrgency] = React.useState(false);
  const [importance, setImportance] = React.useState(false);
  const [tags, setTags] = React.useState<string[]>([]);
  const [tagInput, setTagInput] = React.useState('');
  const [recurrence, setRecurrence] = React.useState<TaskRecurrence | undefined>();
  const [dependencies, setDependencies] = React.useState<TaskDependency[]>([]);
  const [dependencySearch, setDependencySearch] = React.useState('');
  const [showDependencySearch, setShowDependencySearch] = React.useState(false);

  const addTask = useTaskStore((state) => state.addTask);
  const allTasks = useTaskStore((state) => state.groups.flatMap(g => g.tasks));

  const filteredTasks = React.useMemo(() => {
    if (!dependencySearch) return [];
    const search = dependencySearch.toLowerCase();
    return allTasks
      .filter(t => !dependencies.some(d => d.id === t.id))
      .filter(t => t.title.toLowerCase().includes(search))
      .slice(0, 5);
  }, [dependencySearch, allTasks, dependencies]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      category,
      priority,
      date,
      time,
      duration,
      urgency,
      importance,
      status: TaskStatus.NotStarted,
      completed: false,
      tags,
      dependencies,
      recurrence,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addTask(newTask);
    setOpen(false);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory(TaskCategory.Work);
    setPriority(TaskPriority.Medium);
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setTime('');
    setDuration({ hours: 0, minutes: 0 });
    setUrgency(false);
    setImportance(false);
    setTags([]);
    setTagInput('');
    setRecurrence(undefined);
    setDependencies([]);
    setDependencySearch('');
    setShowDependencySearch(false);
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case TaskPriority.High:
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case TaskPriority.Medium:
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case TaskPriority.Low:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
          resetForm();
          onClose();
        }
      }}
    >
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 bg-slate-900/95 border-slate-700/50 backdrop-blur-xl overflow-hidden">
        <div className="relative">
          {/* Glassmorphic Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-50" />
          
          {/* Close Button */}
          <button
            onClick={() => {
              setOpen(false);
              resetForm();
              onClose();
            }}
            className="absolute right-4 top-4 p-2 rounded-full bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-white transition-colors z-10"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <ScrollArea className="h-[80vh]">
            <div className="relative p-6 space-y-8">
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                  Create New Task
                </h2>
                <p className="text-slate-400 mt-1">Add details for your new task</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title & Description */}
                <div className="space-y-4">
                  <div>
                    <Input
                      placeholder="Task title"
                      value={title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                      className="text-lg font-medium bg-transparent border-none focus:ring-0 px-0 h-auto placeholder:text-slate-500"
                      required
                    />
                  </div>

                  <div>
                    <Textarea
                      placeholder="Add description"
                      value={description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                      className="bg-slate-800/30 border-slate-700/50 resize-none placeholder:text-slate-500"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {Object.values(TaskCategory).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "px-4 py-2 rounded-xl border transition-all duration-200",
                        category === cat
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          : "bg-slate-800/30 text-slate-400 border-slate-700/50 hover:bg-slate-700/30"
                      )}
                    >
                      <Tags className="h-4 w-4 inline-block mr-2" />
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Priority Selection */}
                <div className="flex flex-wrap gap-2">
                  {Object.values(TaskPriority).map((pri) => (
                    <button
                      key={pri}
                      type="button"
                      onClick={() => setPriority(pri)}
                      className={cn(
                        "px-4 py-2 rounded-xl border transition-all duration-200",
                        priority === pri
                          ? getPriorityColor(pri)
                          : "bg-slate-800/30 text-slate-400 border-slate-700/50 hover:bg-slate-700/30"
                      )}
                    >
                      <Flag className="h-4 w-4 inline-block mr-2" />
                      {pri}
                    </button>
                  ))}
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-400">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="date"
                        value={date}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
                        className="pl-10 bg-slate-800/30 border-slate-700/50"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-400">Time (optional)</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="time"
                        value={time}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTime(e.target.value)}
                        className="pl-10 bg-slate-800/30 border-slate-700/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label className="text-slate-400">Duration</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Timer className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="number"
                        min="0"
                        placeholder="Hours"
                        value={duration.hours}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setDuration({ ...duration, hours: parseInt(e.target.value) || 0 })}
                        className="pl-10 bg-slate-800/30 border-slate-700/50"
                      />
                    </div>
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        min="0"
                        placeholder="Minutes"
                        value={duration.minutes}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                          setDuration({ ...duration, minutes: parseInt(e.target.value) || 0 })}
                        className="bg-slate-800/30 border-slate-700/50"
                      />
                    </div>
                  </div>
                </div>

                {/* Tags Input */}
                <div className="space-y-2">
                  <Label className="text-slate-400">Tags</Label>
                  <div className="space-y-2">
                    <div className="relative">
                      <Tags className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Add tags (press Enter or comma to add)"
                        value={tagInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
                        onKeyDown={handleTagInput}
                        className="pl-10 bg-slate-800/30 border-slate-700/50"
                      />
                    </div>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1 group"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Task Dependencies */}
                <div className="space-y-2">
                  <Label className="text-slate-400">Dependencies</Label>
                  <div className="space-y-2">
                    <div className="relative">
                      <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search for tasks to add as dependencies"
                        value={dependencySearch}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setDependencySearch(e.target.value);
                          setShowDependencySearch(true);
                        }}
                        onFocus={() => setShowDependencySearch(true)}
                        className="pl-10 bg-slate-800/30 border-slate-700/50"
                      />
                      {showDependencySearch && filteredTasks.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 py-1 rounded-xl bg-slate-800 border border-slate-700/50 shadow-xl">
                          {filteredTasks.map((task) => (
                            <button
                              key={task.id}
                              type="button"
                              onClick={() => {
                                setDependencies([...dependencies, {
                                  id: task.id,
                                  title: task.title,
                                  completed: task.completed
                                }]);
                                setDependencySearch('');
                                setShowDependencySearch(false);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-slate-700/50 text-slate-300"
                            >
                              {task.title}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {dependencies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {dependencies.map((dep) => (
                          <span
                            key={dep.id}
                            className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1 group"
                          >
                            <span>{dep.title}</span>
                            <button
                              type="button"
                              onClick={() => setDependencies(dependencies.filter(d => d.id !== dep.id))}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recurrence */}
                <div className="space-y-2">
                  <Label className="text-slate-400">Recurrence</Label>
                  <div className="space-y-2">
                    <Select
                      value={recurrence?.type || "none"}
                      onValueChange={(value: string) => {
                        if (value === "none") {
                          setRecurrence(undefined);
                        } else {
                          setRecurrence({
                            type: value as TaskRecurrenceType,
                            interval: 1
                          });
                        }
                      }}
                    >
                      <SelectTrigger className="w-full bg-slate-800/30 border-slate-700/50">
                        <div className="flex items-center gap-2">
                          <Repeat className="h-4 w-4 text-slate-400" />
                          <SelectValue placeholder="Select recurrence" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {Object.values(TaskRecurrenceType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {recurrence && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <Input
                              type="number"
                              min="1"
                              placeholder="Interval"
                              value={recurrence.interval}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                setRecurrence({
                                  ...recurrence,
                                  interval: parseInt(e.target.value) || 1
                                })}
                              className="bg-slate-800/30 border-slate-700/50"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              type="date"
                              placeholder="End Date (Optional)"
                              value={recurrence.endDate || ''}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                setRecurrence({
                                  ...recurrence,
                                  endDate: e.target.value || undefined
                                })}
                              className="bg-slate-800/30 border-slate-700/50"
                            />
                          </div>
                        </div>

                        {recurrence.type === TaskRecurrenceType.Custom && (
                          <div className="flex flex-wrap gap-2">
                            {[0, 1, 2, 3, 4, 5, 6].map((day) => {
                              const dayName = new Date(2024, 0, day + 1).toLocaleDateString('en-US', { weekday: 'short' });
                              const isSelected = recurrence.customDays?.includes(day);
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  onClick={() => {
                                    const customDays = recurrence.customDays || [];
                                    setRecurrence({
                                      ...recurrence,
                                      customDays: isSelected
                                        ? customDays.filter(d => d !== day)
                                        : [...customDays, day]
                                    });
                                  }}
                                  className={cn(
                                    "px-3 py-1 rounded-full border transition-colors",
                                    isSelected
                                      ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                      : "bg-slate-800/30 text-slate-400 border-slate-700/50"
                                  )}
                                >
                                  {dayName}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Urgency & Importance */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      <Label htmlFor="urgency" className="font-medium text-white">Urgent</Label>
                    </div>
                    <Switch
                      id="urgency"
                      checked={urgency}
                      onCheckedChange={setUrgency}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-400" />
                      <Label htmlFor="importance" className="font-medium text-white">Important</Label>
                    </div>
                    <Switch
                      id="importance"
                      checked={importance}
                      onCheckedChange={setImportance}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-8"
                  >
                    Create Task
                  </Button>
                </div>
              </form>
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
