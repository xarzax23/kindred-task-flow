import { useState, useEffect } from "react";
import { TaskCard } from "@/components/TaskCard";
import { MotivationZone } from "@/components/MotivationZone";
import { ProgressTracker } from "@/components/ProgressTracker";
import { AddTaskForm } from "@/components/AddTaskForm";
import { WellnessNudge } from "@/components/WellnessNudge";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-illustration.jpg";

interface Task {
  id: string;
  title: string;
  category: "work" | "home" | "wellness" | "personal";
  priority: "low" | "medium" | "high";
  completed: boolean;
  dueTime?: string;
}

const sampleTasks: Task[] = [
  {
    id: "1",
    title: "Morning meditation",
    category: "wellness",
    priority: "medium",
    completed: false,
    dueTime: "08:00"
  },
  {
    id: "2", 
    title: "Review project proposal",
    category: "work",
    priority: "high",
    completed: false,
    dueTime: "10:30"
  },
  {
    id: "3",
    title: "Call mom",
    category: "personal",
    priority: "medium",
    completed: true
  },
  {
    id: "4",
    title: "Grocery shopping",
    category: "home",
    priority: "low",
    completed: false,
    dueTime: "16:00"
  }
];

const completionMessages = [
  "Beautiful work! You're making amazing progress! ✨",
  "That's another win! Keep this energy flowing! 🌟",
  "Fantastic! You're building incredible momentum! 🚀",
  "Way to go! Every task completed is a step forward! 💪",
  "Brilliant! You're absolutely crushing it today! 🎉"
];

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(sampleTasks);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [totalCompleted, setTotalCompleted] = useState(127); // Demo number
  const [weeklyStreak, setWeeklyStreak] = useState(5); // Demo number
  const { toast } = useToast();

  const todayCompleted = tasks.filter(task => task.completed).length;
  const todayTotal = tasks.length;

  const handleToggleComplete = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (task.id === id) {
          const newCompleted = !task.completed;
          
          // Show completion celebration
          if (newCompleted) {
            const randomMessage = completionMessages[Math.floor(Math.random() * completionMessages.length)];
            toast({
              title: "Task Completed! 🎯",
              description: randomMessage,
              duration: 3000,
            });
            setTotalCompleted(prev => prev + 1);
          } else {
            setTotalCompleted(prev => prev - 1);
          }
          
          return { ...task, completed: newCompleted };
        }
        return task;
      })
    );
  };

  const handleAddTask = (newTask: Omit<Task, "id" | "completed">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      completed: false
    };
    setTasks(prev => [...prev, task]);
    
    toast({
      title: "Task Added! 📝",
      description: "Ready to make it happen? You've got this!",
      duration: 2000,
    });
  };

  return (
    <div className="bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 to-primary-glow/10 px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <img 
              src={heroImage} 
              alt="Productivity illustration" 
              className="w-full h-32 object-cover rounded-2xl shadow-lg"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Your Daily Companion
          </h1>
          <p className="text-muted-foreground text-sm">
            Productivity meets wellness, one task at a time
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Motivation Zone */}
        <MotivationZone />

        {/* Progress Tracker */}
        <ProgressTracker 
          todayCompleted={todayCompleted}
          todayTotal={todayTotal}
          weeklyStreak={weeklyStreak}
          totalCompleted={totalCompleted}
        />

        {/* Add Task Form */}
        <AddTaskForm 
          onAddTask={handleAddTask}
          isOpen={isAddingTask}
          onToggle={() => setIsAddingTask(!isAddingTask)}
        />

        {/* Today's Tasks */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            Today's Focus
            <span className="text-sm font-normal text-muted-foreground">
              ({todayCompleted}/{todayTotal})
            </span>
          </h2>
          
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>

          {tasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No tasks yet. Ready to add your first one? 🌟</p>
            </div>
          )}
        </div>

        {/* Wellness Nudge */}
        <WellnessNudge />

        {/* Bottom Spacing */}
        <div className="h-6" />
      </div>
    </div>
  );
};

export default Index;