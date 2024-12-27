import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Task, TaskGroup, TaskStatus, TaskRecurrenceType, TaskCategory } from '@/types/task';
import { produce } from 'immer';
import { addDays, addWeeks, addMonths, isBefore, startOfDay } from 'date-fns';

interface TaskState {
  groups: TaskGroup[];
  expandedGroups: Record<string, boolean>;
  addTask: (task: Task) => void;
  toggleGroup: (groupId: string) => void;
  toggleTask: (groupId: string, taskId: string) => void;
  deleteGroup: (groupId: string) => void;
  deleteTask: (groupId: string, taskId: string) => void;
  updateTask: (groupId: string, taskId: string, updates: Partial<Task>) => void;
}

const useTaskStore = create<TaskState>()(
  persist(
    (set) => ({
      groups: [],
      expandedGroups: {},

      addTask: (task) =>
        set(
          produce((state: TaskState) => {
            try {
              // Handle recurring tasks
              if (task.recurrence) {
                const startDate = new Date(task.date);
                const endDate = task.recurrence.endDate 
                  ? new Date(task.recurrence.endDate)
                  : addMonths(startDate, 3); // Default to 3 months if no end date

                let currentDate = startDate;
                const allTasks: Task[] = [];
                const groupUpdates = new Map<string, Task[]>();

                while (isBefore(currentDate, endDate)) {
                  let nextDate: Date;

                  switch (task.recurrence.type) {
                    case TaskRecurrenceType.Daily:
                      nextDate = addDays(currentDate, task.recurrence.interval);
                      break;
                    case TaskRecurrenceType.Weekly:
                      nextDate = addWeeks(currentDate, task.recurrence.interval);
                      break;
                    case TaskRecurrenceType.Monthly:
                      nextDate = addMonths(currentDate, task.recurrence.interval);
                      break;
                    case TaskRecurrenceType.Custom:
                      if (task.recurrence.customDays?.length) {
                        const today = currentDate.getDay();
                        const nextDayIndex = task.recurrence.customDays.findIndex(d => d > today);
                        if (nextDayIndex !== -1) {
                          const daysToAdd = task.recurrence.customDays[nextDayIndex] - today;
                          nextDate = addDays(currentDate, daysToAdd);
                        } else {
                          // Move to next week's first custom day
                          const daysToAdd = 7 - today + task.recurrence.customDays[0];
                          nextDate = addDays(currentDate, daysToAdd);
                        }
                      } else {
                        nextDate = addDays(currentDate, 1);
                      }
                      break;
                    default:
                      nextDate = addDays(currentDate, 1);
                  }

                  currentDate = nextDate;
                  
                  // Skip if we've passed the end date
                  if (!isBefore(startOfDay(currentDate), startOfDay(endDate))) break;

                  // Create the recurring task instance
                  const recurringTask: Task = {
                    ...task,
                    id: crypto.randomUUID(),
                    date: currentDate.toISOString().split('T')[0],
                    completed: false,
                    status: TaskStatus.NotStarted,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  };

                  allTasks.push(recurringTask);
                }

                // Batch process all tasks
                allTasks.forEach(t => {
                  const key = `${t.category}-${t.date}`;
                  if (!groupUpdates.has(key)) {
                    groupUpdates.set(key, []);
                  }
                  groupUpdates.get(key)!.push(t);
                });

                // Update state in batch
                groupUpdates.forEach((tasks, key) => {
                  const [category, date] = key.split('-');
                  const existingGroup = state.groups.find(
                    (g) => g.category === category && g.date === date
                  );

                  if (existingGroup) {
                    existingGroup.tasks.push(...tasks);
                  } else {
                    const newGroup: TaskGroup = {
                      id: crypto.randomUUID(),
                      title: category,
                      category: category as TaskCategory,
                      date: date,
                      time: tasks[0].time,
                      tasks: tasks,
                    };
                    state.groups.push(newGroup);
                    state.expandedGroups[newGroup.id] = true;
                  }
                });
              } else {
                // Handle non-recurring tasks with optimized logic
                const existingGroup = state.groups.find(
                  (g) => g.category === task.category && g.date === task.date
                );

                if (existingGroup) {
                  existingGroup.tasks.push({
                    ...task,
                    status: task.status || TaskStatus.NotStarted,
                    completed: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  });
                } else {
                  const newGroup: TaskGroup = {
                    id: crypto.randomUUID(),
                    title: task.category,
                    category: task.category,
                    date: task.date,
                    time: task.time,
                    tasks: [{
                      ...task,
                      status: task.status || TaskStatus.NotStarted,
                      completed: false,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    }],
                  };
                  state.groups.push(newGroup);
                  state.expandedGroups[newGroup.id] = true;
                }
              }
            } catch (error) {
              console.error('Error adding task:', error);
            }
          })
        ),

      toggleGroup: (groupId) =>
        set(
          produce((state: TaskState) => {
            state.expandedGroups[groupId] = !state.expandedGroups[groupId];
          })
        ),

      toggleTask: (groupId, taskId) =>
        set(
          produce((state: TaskState) => {
            try {
              const group = state.groups.find((g) => g.id === groupId);
              if (group) {
                const task = group.tasks.find((t) => t.id === taskId);
                if (task) {
                  task.completed = !task.completed;
                  task.status = task.completed ? TaskStatus.Completed : TaskStatus.NotStarted;
                  task.updatedAt = new Date().toISOString();

                  // Update dependent tasks
                  state.groups.forEach(g => {
                    g.tasks.forEach(t => {
                      if (t.dependencies?.some(d => d.id === task.id)) {
                        const dependency = t.dependencies.find(d => d.id === task.id);
                        if (dependency) {
                          dependency.completed = task.completed;
                        }
                      }
                    });
                  });
                }
              }
            } catch (error) {
              console.error('Error toggling task:', error);
            }
          })
        ),

      deleteGroup: (groupId) =>
        set(
          produce((state: TaskState) => {
            try {
              state.groups = state.groups.filter((group) => group.id !== groupId);
              delete state.expandedGroups[groupId];
            } catch (error) {
              console.error('Error deleting group:', error);
            }
          })
        ),

      deleteTask: (groupId, taskId) =>
        set(
          produce((state: TaskState) => {
            try {
              const group = state.groups.find((g) => g.id === groupId);
              if (group) {
                group.tasks = group.tasks.filter((task) => task.id !== taskId);
                if (group.tasks.length === 0) {
                  state.groups = state.groups.filter((g) => g.id !== groupId);
                  delete state.expandedGroups[groupId];
                }

                // Remove task from dependencies
                state.groups.forEach(g => {
                  g.tasks.forEach(t => {
                    if (t.dependencies) {
                      t.dependencies = t.dependencies.filter(d => d.id !== taskId);
                    }
                  });
                });
              }
            } catch (error) {
              console.error('Error deleting task:', error);
            }
          })
        ),

      updateTask: (groupId, taskId, updates) =>
        set(
          produce((state: TaskState) => {
            try {
              const group = state.groups.find((g) => g.id === groupId);
              if (group) {
                const taskIndex = group.tasks.findIndex((t) => t.id === taskId);
                if (taskIndex !== -1) {
                  group.tasks[taskIndex] = {
                    ...group.tasks[taskIndex],
                    ...updates,
                    updatedAt: new Date().toISOString(),
                  };

                  // Update task title in dependencies
                  if (updates.title) {
                    state.groups.forEach(g => {
                      g.tasks.forEach(t => {
                        if (t.dependencies) {
                          const dependency = t.dependencies.find(d => d.id === taskId);
                          if (dependency) {
                            dependency.title = updates.title!;
                          }
                        }
                      });
                    });
                  }
                }
              }
            } catch (error) {
              console.error('Error updating task:', error);
            }
          })
        ),
    }),
    {
      name: 'nirmaanverse-tasks',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        groups: state.groups,
        expandedGroups: state.expandedGroups,
      }),
      version: 1,
      onRehydrateStorage: () => (state) => {
        console.log('State hydrated:', state);
      },
    }
  )
);

export default useTaskStore; 