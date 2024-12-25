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
  dependencies?: string[];
  prerequisites?: string[];
  subtasks?: Task[];
  templateId?: string;
  tags?: string[];
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