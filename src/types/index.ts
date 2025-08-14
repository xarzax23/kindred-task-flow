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
 * Una franja de tiempo recurrente asociada a una categoría.
 * daysOfWeek es un array con los días de la semana en los que se aplica (0=domingo, 6=sábado).
 * Si está vacío o indefinido, la franja se aplica todos los días.
 */
export interface TimeBlock {
  id: string;
  categoryId: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
}
