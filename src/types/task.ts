export enum TaskPriority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low'
}

export enum TaskCategory {
  Work = 'Work',
  PersonalGrowth = 'Personal Growth',
  Learning = 'Learning',
  Health = 'Health',
  Social = 'Social',
  Other = 'Other'
}

export enum TaskStatus {
  NotStarted = 'Not Started',
  InProgress = 'In Progress',
  Completed = 'Completed',
  OnHold = 'On Hold'
}

export enum TaskRecurrenceType {
  Daily = 'Daily',
  Weekly = 'Weekly',
  Monthly = 'Monthly',
  Custom = 'Custom'
}

export interface TaskRecurrence {
  type: TaskRecurrenceType;
  interval: number;
  endDate?: string;
  customDays?: number[];
}

export interface TaskDependency {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskDuration {
  hours: number;
  minutes: number;
}

export interface TaskMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  completed: boolean;
  duration?: TaskDuration;
  actualTimeSpent?: TaskDuration;
  urgency: boolean;
  importance: boolean;
  milestones?: TaskMilestone[];
  dependencies?: TaskDependency[];
  prerequisites?: TaskDependency[];
  subtasks?: Task[];
  templateId?: string;
  tags?: string[];
  recurrence?: TaskRecurrence;
  createdAt: string;
  updatedAt: string;
}

export interface TaskGroup {
  id: string;
  title: string;
  category: TaskCategory;
  date: string;
  time?: string;
  tasks: Task[];
}

export interface TaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageTimeSpent: TaskDuration;
  tasksByCategory: Record<TaskCategory, number>;
  tasksByPriority: Record<TaskPriority, number>;
  tasksByStatus: Record<TaskStatus, number>;
  urgentImportantMatrix: {
    urgentImportant: number;
    urgentNotImportant: number;
    notUrgentImportant: number;
    notUrgentNotImportant: number;
  };
} 