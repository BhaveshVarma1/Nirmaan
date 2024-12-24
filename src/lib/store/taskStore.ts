import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Task, TaskGroup, TaskCategory, TaskPriority, TaskStatus } from '@/types/task';
import { produce } from 'immer';

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
              const existingGroup = state.groups.find(
                (g) => g.category === task.category && g.date === task.date
              );

              if (existingGroup) {
                const groupIndex = state.groups.findIndex((g) => g.id === existingGroup.id);
                if (groupIndex !== -1) {
                  state.groups[groupIndex].tasks.push({
                    ...task,
                    status: task.status || TaskStatus.NotStarted,
                    completed: false,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  });
                }
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