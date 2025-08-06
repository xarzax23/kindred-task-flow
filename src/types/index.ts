export interface TimeBlock {
  id: string;
  label: string;
  startTime: Date;
  endTime: Date;
  color: string; // e.g., '#ff0000'
}

export interface Task {
  id: string;
  title: string;
  category: "work" | "home" | "wellness" | "personal";
  priority: "low" | "medium" | "high";
  completed: boolean;
  dueDate: Date;
  startTime?: string;
  endTime?: string;
  duration: number;
}
