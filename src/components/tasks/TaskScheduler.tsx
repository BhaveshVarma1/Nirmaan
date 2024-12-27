import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, Plus, Calendar as CalendarViewIcon, List, BarChart2, Trash, X, CheckSquare } from 'lucide-react';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import useTaskStore from '@/lib/store/taskStore';
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns';
import AddTaskDialog from './AddTaskDialog';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DragDropContext, Draggable, Droppable, DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';
import { Checkbox } from '@/components/ui/checkbox';

const TaskScheduler = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedDate] = useState(new Date());
  const [view, setView] = useState<'calendar' | 'list' | 'timeline'>('calendar');
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);
  const tasks = useTaskStore((state) => state.groups.flatMap((group) => group.tasks));
  const updateTask = useTaskStore((state) => state.updateTask);
  const deleteTask = useTaskStore((state) => state.deleteTask);

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
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case TaskPriority.Medium:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case TaskPriority.Low:
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/50';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.Completed:
        return 'bg-green-500/20 text-green-400';
      case TaskStatus.InProgress:
        return 'bg-blue-500/20 text-blue-400';
      case TaskStatus.NotStarted:
        return 'bg-slate-500/20 text-slate-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  // Generate week days for calendar view
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const start = startOfWeek(selectedDate);
    return addDays(start, i);
  });

  // Group tasks by time for the selected date
  const getTasksByTime = (date: Date) => {
    const dayTasks = tasks.filter(task => 
      task.date && isSameDay(parseISO(task.date), date)
    );
    return dayTasks.sort((a, b) => {
      if (!a.time) return 1;
      if (!b.time) return -1;
      return a.time.localeCompare(b.time);
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const taskId = result.draggableId;
    const newDate = result.destination.droppableId;
    const task = tasks.find(t => t.id === taskId);
    
    if (task) {
      const groupId = useTaskStore.getState().groups.find(g => 
        g.tasks.some(t => t.id === taskId)
      )?.id;

      if (groupId) {
        updateTask(groupId, taskId, { ...task, date: newDate });
      }
    }
  };

  const handleTaskSelect = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedTasks(new Set(tasks.map(t => t.id)));
      setShowBulkActions(true);
    }
  };

  const handleBulkDelete = () => {
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedTasks.size} tasks?`);
    if (confirmed) {
      selectedTasks.forEach(taskId => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
          const groupId = useTaskStore.getState().groups.find(g => 
            g.tasks.some(t => t.id === taskId)
          )?.id;
          if (groupId) {
            deleteTask(groupId, taskId);
          }
        }
      });
      setSelectedTasks(new Set());
      setShowBulkActions(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-200">Task Schedule</h2>
        <div className="flex items-center gap-4">
          {showBulkActions ? (
            <>
              <Button
                variant="destructive"
                onClick={handleBulkDelete}
                className="gap-2"
              >
                <Trash className="h-4 w-4" />
                Delete Selected ({selectedTasks.size})
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedTasks(new Set());
                  setShowBulkActions(false);
                }}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleSelectAll}
                className="gap-2"
              >
                <CheckSquare className="h-4 w-4" />
                {selectedTasks.size === tasks.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Button onClick={() => setShowAddTask(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </>
          )}
        </div>
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as typeof view)} className="space-y-4">
        <TabsList className="bg-slate-800/50">
          <TabsTrigger value="calendar" className="gap-2">
            <CalendarViewIcon className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="list" className="gap-2">
            <List className="h-4 w-4" />
            List
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2">
            <BarChart2 className="h-4 w-4" />
            Timeline
          </TabsTrigger>
        </TabsList>

        <DragDropContext onDragEnd={handleDragEnd}>
          <TabsContent value="calendar" className="mt-0">
            <div className="grid grid-cols-7 gap-4">
              {weekDays.map((date) => (
                <Droppable key={format(date, 'yyyy-MM-dd')} droppableId={format(date, 'yyyy-MM-dd')}>
                  {(provided: DroppableProvided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-h-[300px] p-4 rounded-xl bg-slate-800/30 border border-slate-700/50"
                    >
                      <div className="text-sm font-medium text-slate-400 mb-3">
                        {format(date, 'EEE, MMM d')}
                      </div>
                      <ScrollArea className="h-[calc(100vh-300px)]">
                        <div className="space-y-2">
                          {getTasksByTime(date).map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided: DraggableProvided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    "p-3 rounded-lg border relative group",
                                    getPriorityColor(task.priority),
                                    selectedTasks.has(task.id) && "ring-2 ring-blue-500"
                                  )}
                                  onClick={(e) => {
                                    if (showBulkActions) {
                                      e.preventDefault();
                                      handleTaskSelect(task.id);
                                    }
                                  }}
                                >
                                  <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Checkbox
                                      checked={selectedTasks.has(task.id)}
                                      onCheckedChange={() => handleTaskSelect(task.id)}
                                      className="h-4 w-4"
                                    />
                                  </div>
                                  <div className="text-sm font-medium">{task.title}</div>
                                  {task.time && (
                                    <div className="flex items-center gap-1 mt-1 text-xs opacity-80">
                                      <Clock className="h-3 w-3" />
                                      {task.time}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className={cn(
                                      "px-2 py-0.5 text-xs rounded",
                                      getStatusColor(task.status)
                                    )}>
                                      {task.status}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      </ScrollArea>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <div className="grid gap-6">
              {dates.map((date) => (
                <div key={date} className="space-y-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CalendarIcon className="h-4 w-4" />
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
                              className={cn(
                                'px-2 py-1 text-xs rounded-lg',
                                getStatusColor(task.status)
                              )}
                            >
                              {task.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="mt-0">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-700/50" />
              <div className="space-y-8">
                {dates.map((date) => (
                  <div key={date} className="relative pl-16">
                    <div className="absolute left-6 w-4 h-4 rounded-full bg-slate-700 border-4 border-slate-900" />
                    <div className="space-y-4">
                      <h3 className="font-medium text-slate-300">
                        {format(new Date(date), 'EEEE, MMMM d')}
                      </h3>
                      <div className="space-y-3">
                        {tasksByDate[date].map((task) => (
                          <div
                            key={task.id}
                            className={cn(
                              "p-4 rounded-xl border",
                              getPriorityColor(task.priority)
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{task.title}</h4>
                              <div className="flex items-center gap-2">
                                {task.time && (
                                  <div className="flex items-center gap-1 text-sm">
                                    <Clock className="h-4 w-4" />
                                    {task.time}
                                  </div>
                                )}
                                <span
                                  className={cn(
                                    'px-2 py-1 text-xs rounded-lg',
                                    getStatusColor(task.status)
                                  )}
                                >
                                  {task.status}
                                </span>
                              </div>
                            </div>
                            {task.description && (
                              <p className="mt-2 text-sm opacity-80">{task.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </DragDropContext>
      </Tabs>

      {showAddTask && (
        <AddTaskDialog
          onClose={() => setShowAddTask(false)}
        />
      )}
    </div>
  );
};

export default TaskScheduler; 