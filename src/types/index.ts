export interface Category {
  id: string;
  label: string;
  color: string;
}

export interface CalendarEvent {
  id: string;
  categoryId: string;
  startTime: Date;
  endTime: Date;
}

export interface Task {
  id: string;
  title: string;
  categoryId: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  dueDate: Date;
  startTime?: string;
  endTime?: string;
  duration: number;
}