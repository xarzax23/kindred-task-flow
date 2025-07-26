import { useState } from "react";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AddTaskForm } from "@/components/AddTaskForm";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  category: "work" | "home" | "wellness" | "personal";
  priority: "low" | "medium" | "high";
  completed: boolean;
  dueDate?: Date;
  dueTime?: string;
}

const sampleScheduledTasks: Task[] = [
  {
    id: "cal-1",
    title: "Team standup meeting",
    category: "work",
    priority: "high",
    completed: false,
    dueDate: new Date(),
    dueTime: "09:00"
  },
  {
    id: "cal-2",
    title: "Yoga session",
    category: "wellness",
    priority: "medium",
    completed: false,
    dueDate: new Date(),
    dueTime: "18:00"
  },
  {
    id: "cal-3",
    title: "Grocery shopping",
    category: "home",
    priority: "low",
    completed: false,
    dueDate: new Date(Date.now() + 86400000), // Tomorrow
    dueTime: "15:00"
  }
];

const categoryColors = {
  work: "bg-primary/20 text-primary border-primary/30",
  home: "bg-accent/20 text-accent-foreground border-accent/30",
  wellness: "bg-wellness/20 text-wellness border-wellness/30",
  personal: "bg-purple-100 text-purple-700 border-purple-200"
};

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>(sampleScheduledTasks);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => task.dueDate && isSameDay(task.dueDate, date));
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  const handleAddTask = (newTask: Omit<Task, "id" | "completed">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      completed: false,
      dueDate: selectedDate
    };
    setTasks(prev => [...prev, task]);
  };

  const handleToggleComplete = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Schedule and manage your tasks</p>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              Jump to Date
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setCurrentMonth(date);
                }
              }}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {format(currentMonth, "MMMM yyyy")}
              </h2>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map(day => {
                const dayTasks = getTasksForDate(day);
                const isSelected = isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "p-2 min-h-[60px] rounded-lg border-2 transition-all duration-200 flex flex-col items-center gap-1",
                      isSelected 
                        ? "border-primary bg-primary/10" 
                        : "border-transparent hover:border-muted hover:bg-muted/50",
                      isTodayDate && "ring-2 ring-primary/30"
                    )}
                  >
                    <span className={cn(
                      "text-sm font-medium",
                      isTodayDate ? "text-primary font-bold" : "text-foreground"
                    )}>
                      {format(day, "d")}
                    </span>
                    {dayTasks.length > 0 && (
                      <div className="flex gap-1 flex-wrap justify-center">
                        {dayTasks.slice(0, 3).map(task => (
                          <div 
                            key={task.id}
                            className={cn(
                              "w-2 h-2 rounded-full",
                              task.completed ? "bg-wellness" : "bg-primary"
                            )}
                          />
                        ))}
                        {dayTasks.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{dayTasks.length - 3}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Selected Date Tasks */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">
                  {format(selectedDate, "EEEE, MMM d")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedDateTasks.length} tasks scheduled
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setIsAddingTask(true)}
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>

            {/* Add Task Form */}
            {isAddingTask && (
              <div className="mb-4">
                <AddTaskForm
                  onAddTask={handleAddTask}
                  isOpen={isAddingTask}
                  onToggle={() => setIsAddingTask(!isAddingTask)}
                />
              </div>
            )}

            {/* Tasks List */}
            <div className="space-y-3">
              {selectedDateTasks.map(task => (
                <div key={task.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task.id)}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <span className={cn(
                      "font-medium text-sm flex-1",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-6">
                    <Badge variant="outline" className={cn("text-xs", categoryColors[task.category])}>
                      {task.category}
                    </Badge>
                    {task.dueTime && (
                      <span className="text-xs text-muted-foreground">
                        {task.dueTime}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {selectedDateTasks.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No tasks scheduled for this day</p>
                  <p className="text-xs">Click "Add" to create your first task!</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}