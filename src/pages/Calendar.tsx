import { useState } from "react";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday, startOfWeek, endOfWeek, addDays } from "date-fns";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AddTaskForm } from "@/components/AddTaskForm";
import { cn } from "@/lib/utils";
import { useTasks } from "@/context/TaskContext";
import { Task } from "@/context/TaskContext";
import DayView from "./DayView";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";


const categoryColors: Record<Task['category'], string> = {
  work: "bg-primary/20 text-primary border-primary/30",
  home: "bg-accent/20 text-accent-foreground border-accent/30",
  wellness: "bg-green-100 text-green-700 border-green-200",
  personal: "bg-purple-100 text-purple-700 border-purple-200",
};

type CalendarView = 'month' | 'week' | 'day';

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const { tasks, addTask, toggleTask } = useTasks();
  const [isAddingTask, setIsAddingTask] = useState(false);

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => task.dueDate && isSameDay(task.dueDate, date))
                .sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
  };

  const handleAddTask = (newTask: Omit<Task, "id" | "completed">) => {
    addTask({ ...newTask, dueDate: selectedDate });
  };

  const navigate = (direction: 'prev' | 'next') => {
    if (view === 'month') {
      setCurrentDate(prev => {
        const newMonth = new Date(prev);
        newMonth.setMonth(prev.getMonth() + (direction === 'prev' ? -1 : 1));
        return newMonth;
      });
    } else if (view === 'week') {
      setCurrentDate(prev => addDays(prev, direction === 'prev' ? -7 : 7));
    } else {
      setSelectedDate(prev => addDays(prev, direction === 'prev' ? -1 : 1));
    }
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarDays = eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(monthEnd) });

    return (
      <Card className="p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(day => {
            const dayTasks = getTasksForDate(day);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "p-2 min-h-[80px] rounded-lg border-2 transition-all flex flex-col items-start gap-1",
                  isSelected ? "border-primary bg-primary/10" : "border-transparent hover:border-muted hover:bg-muted/50",
                  !isCurrentMonth && "text-muted-foreground/50 bg-muted/20",
                  isToday(day) && "ring-2 ring-primary/30"
                )}
              >
                <span className={cn("font-medium", isToday(day) ? "text-primary" : "")}>{format(day, "d")}</span>
                {dayTasks.length > 0 && (
                  <div className="flex flex-col items-start w-full gap-1">
                    {dayTasks.slice(0, 2).map(task => (
                      <div key={task.id} className={cn("w-full h-1.5 rounded-full", categoryColors[task.category])} />
                    ))}
                    {dayTasks.length > 2 && <span className="text-xs text-muted-foreground">+{dayTasks.length - 2} more</span>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Card>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return (
      <Card className="p-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(day => (
            <div key={day.toISOString()} className="space-y-2">
              <div className="text-center font-semibold">{format(day, "EEE d")}</div>
              <div className="space-y-2 p-1 rounded-md bg-muted/30 min-h-[100px]">
                {getTasksForDate(day).map(task => (
                  <div key={task.id} className="p-1.5 rounded-md text-xs bg-background border shadow-sm">
                    <p className="font-medium truncate">{task.title}</p>
                    <p className="text-muted-foreground">{task.startTime}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const renderDayView = () => <DayView />;

  const getHeaderTitle = () => {
    if (view === 'month') return format(currentDate, "MMMM yyyy");
    if (view === 'week') {
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = endOfWeek(selectedDate);
      return `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;
    }
    return format(selectedDate, "EEEE, MMMM d, yyyy");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{getHeaderTitle()}</h1>
          <p className="text-muted-foreground">Your schedule at a glance</p>
        </div>
        <div className="flex gap-2">
          <Button variant={view === 'month' ? 'default' : 'outline'} onClick={() => setView('month')}>Month</Button>
          <Button variant={view === 'week' ? 'default' : 'outline'} onClick={() => setView('week')}>Week</Button>
          <Button variant={view === 'day' ? 'default' : 'outline'} onClick={() => setView('day')}>Day</Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('prev')}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => navigate('next')}><ChevronRight className="h-4 w-4" /></Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2"><CalendarIcon className="h-4 w-4" />Jump to Date</Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {view === 'month' && renderMonthView()}
          {view === 'week' && renderWeekView()}
          {view === 'day' && renderDayView()}
        </div>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{format(selectedDate, "EEEE, MMM d")}</h3>
                <p className="text-sm text-muted-foreground">{getTasksForDate(selectedDate).filter(t => !t.completed).length} tasks remaining</p>
              </div>
              <Button size="sm" onClick={() => setIsAddingTask(true)} className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary">
                <Plus className="h-4 w-4 mr-1" />Add
              </Button>
            </div>
            {isAddingTask && (
              <div className="mb-4">
                <AddTaskForm onAddTask={handleAddTask} isOpen={isAddingTask} onToggle={() => setIsAddingTask(!isAddingTask)} />
              </div>
            )}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getTasksForDate(selectedDate).map(task => (
                <div key={task.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} className="w-4 h-4 text-primary rounded focus:ring-primary" />
                    <span className={cn("font-medium text-sm flex-1", task.completed && "line-through text-muted-foreground")}>{task.title}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-6">
                    <Badge variant="outline" className={cn("text-xs", categoryColors[task.category])}>{task.category}</Badge>
                    {(task.startTime || task.endTime) && (
                      <span className="text-xs text-muted-foreground">
                        {task.startTime && <span>{task.startTime}</span>}
                        {task.startTime && task.endTime && <span>-</span>}
                        {task.endTime && <span>{task.endTime}</span>}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {getTasksForDate(selectedDate).length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <CalendarIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No tasks for this day</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}