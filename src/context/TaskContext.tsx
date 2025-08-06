import { createContext, useState, ReactNode, useContext } from "react";

interface Task {
  id: string;
  title: string;
  category: "work" | "home" | "wellness" | "personal";
  priority: "low" | "medium" | "high";
  completed: boolean;
  dueDate: Date;
  startTime?: string; // New: Optional start time (e.g., "09:00")
  endTime?: string;   // New: Optional end time (e.g., "10:00")
  duration: number; // in minutes
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "completed">) => void;
  updateTask: (task: Task) => void;
  toggleTask: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

const sampleTasks: Task[] = [
    {
      id: "1",
      title: "Morning meditation",
      category: "wellness",
      priority: "medium",
      completed: false,
      dueDate: new Date(2025, 6, 29), // July 29, 2025
      startTime: "08:00",
      endTime: "08:15",
      duration: 15,
    },
    {
      id: "2", 
      title: "Review project proposal",
      category: "work",
      priority: "high",
      completed: false,
      dueDate: new Date(2025, 6, 29), // July 29, 2025
      startTime: "10:30",
      endTime: "11:30",
      duration: 60,
    },
    {
      id: "3",
      title: "Call mom",
      category: "personal",
      priority: "medium",
      completed: true,
      dueDate: new Date(2025, 6, 28), // July 28, 2025
      startTime: "14:00",
      endTime: "14:10",
      duration: 10,
    },
    {
      id: "4",
      title: "Grocery shopping",
      category: "home",
      priority: "low",
      completed: false,
      dueDate: new Date(2025, 7, 1), // August 1, 2025
      startTime: "16:00",
      endTime: "16:45",
      duration: 45,
    },
    {
      id: "5",
      title: "Team meeting",
      category: "work",
      priority: "high",
      completed: false,
      dueDate: new Date(2025, 7, 2), // August 2, 2025
      startTime: "09:00",
      endTime: "10:00",
      duration: 60,
    },
    {
      id: "6",
      title: "Yoga class",
      category: "wellness",
      priority: "medium",
      completed: false,
      dueDate: new Date(2025, 7, 3), // August 3, 2025
      startTime: "18:00",
      endTime: "19:00",
      duration: 60,
    }
  ];

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);

  const addTask = (task: Omit<Task, "id" | "completed">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      completed: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};