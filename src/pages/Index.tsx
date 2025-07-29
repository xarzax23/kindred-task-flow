import { useState } from "react";
import { TaskCard } from "@/components/TaskCard";
import { MotivationZone } from "@/components/MotivationZone";
import { ProgressTracker } from "@/components/ProgressTracker";
import { AddTaskForm } from "@/components/AddTaskForm";
import { WellnessNudge } from "@/components/WellnessNudge";
import { useToast } from "@/hooks/use-toast";
import { useTasks } from "@/context/TaskContext";
import { isToday } from "date-fns";
import heroImage from "@/assets/hero-illustration.jpg";

const completionMessages = [
  "Beautiful work! You're making amazing progress! ✨",
  "That's another win! Keep this energy flowing! 🌟",
  "Fantastic! You're building incredible momentum! 🚀",
  "Way to go! Every task completed is a step forward! 💪",
  "Brilliant! You're absolutely crushing it today! 🎉"
];

const Index = () => {
  const { tasks, addTask, toggleTask } = useTasks();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { toast } = useToast();

  const todayTasks = tasks.filter(task => isToday(task.dueDate));
  const todayCompleted = todayTasks.filter(task => task.completed).length;
  const todayTotal = todayTasks.length;
  const totalCompleted = tasks.filter(task => task.completed).length;
  const weeklyStreak = 5; // This is still a demo number, we can address this later

  const handleToggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
        const randomMessage = completionMessages[Math.floor(Math.random() * completionMessages.length)];
        toast({
            title: "Task Completed! 🎯",
            description: randomMessage,
            duration: 3000,
        });
    }
    toggleTask(id);
  };

  const handleAddTask = (newTask: Omit<Task, "id" | "completed">) => {
    addTask({ ...newTask, dueDate: new Date() });
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
            {todayTasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>

          {todayTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">No tasks for today. Add a task to get started! 🌟</p>
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