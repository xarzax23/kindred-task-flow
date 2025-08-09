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

/**
 * A TimeBlock represents a recurring block of time in which tasks of a
 * particular category should be scheduled. For example, if you always
 * dedicate Monday to Friday from 19:00 to 21:00 to household chores, you
 * would create a TimeBlock with the categoryId of “Home”, startTime
 * "19:00" and endTime "21:00".  When new tasks are created for that
 * category, the AddTaskForm will automatically default the task’s
 * start and end times to the values defined here.
 */
export interface TimeBlock {
  /** Unique identifier for the time block */
  id: string;
  /** The category that this time block applies to */
  categoryId: string;
  /**
   * Start time in 24‑hour HH:MM format.  Do not include a date – the block
   * will be applied on whatever date the task is scheduled for.
   */
  startTime: string;
  /** End time in 24‑hour HH:MM format */
  endTime: string;
}