import { useState, useRef, useEffect, useMemo } from "react";
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isToday, startOfWeek, endOfWeek, addDays } from "date-fns";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, ZoomIn, ZoomOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AddTaskForm } from "@/components/AddTaskForm";
import { cn } from "@/lib/utils";
import { useTasks } from "@/context/TaskContext";
import { useTimeBlocks } from "@/context/TimeBlockContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TimeBlockForm } from "@/components/TimeBlockForm";
import { Task, TimeBlock } from "@/types";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const categoryColors: Record<Task['category'], string> = {
  work: "bg-primary/20 text-primary border-primary/30",
  home: "bg-accent/20 text-accent-foreground border-accent/30",
  wellness: "bg-green-100 text-green-700 border-green-200",
  personal: "bg-purple-100 text-purple-700 border-purple-200",
};

type CalendarView = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const { tasks, addTask, toggleTask, updateTask } = useTasks();
  const { timeBlocks, deleteTimeBlock } = useTimeBlocks();
  const [isTimeBlockModalOpen, setIsTimeBlockModalOpen] = useState(false);
  const [selectedTimeBlock, setSelectedTimeBlock] = useState<TimeBlock | undefined>(undefined);
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  const zoomLevels = [
    { slotDuration: '01:00:00', slotLabelInterval: '01:00:00' }, // Zoom out
    { slotDuration: '00:30:00', slotLabelInterval: '00:30:00' }, // Default
    { slotDuration: '00:15:00', slotLabelInterval: '00:30:00' }  // Zoom in
  ];
  const [zoomLevel, setZoomLevel] = useState(1); // Default zoom level

  const calendarRef = useRef<FullCalendar>(null);

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => isSameDay(task.dueDate, date));
  };

  const handleAddTask = (newTask: Omit<Task, "id" | "completed">) => {
    addTask({ ...newTask, dueDate: selectedDate });
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, zoomLevels.length - 1));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 0));
  };

  const events = useMemo(() => [
    ...tasks.map(task => ({
      id: task.id,
      title: task.title,
      start: `${format(task.dueDate, 'yyyy-MM-dd')}T${task.startTime || '00:00:00'}`,
      end: task.endTime ? `${format(task.dueDate, 'yyyy-MM-dd')}T${task.endTime}` : undefined,
      duration: task.duration,
      // color: categoryColors[task.category].split(' ')[0].replace('bg-', '#').replace('/20', ''), // Extract hex color
      // For now, let's use a default color or rely on FullCalendar's default styling
      color: '#3788d8', // A default blue color
      extendedProps: {
        task: task,
      },
    })),
    ...timeBlocks.map(tb => ({
      id: tb.id,
      title: tb.label,
      start: tb.startTime.toISOString(),
      end: tb.endTime.toISOString(),
      color: tb.color,
      display: 'background',
      extendedProps: {
        timeBlock: tb,
      },
    })),
  ], [tasks, timeBlocks]);

  console.log("FullCalendar Events:", events);

  const handleEventClick = (clickInfo: any) => {
    // Handle event click, e.g., open edit modal for task or time block
    console.log('Event clicked:', clickInfo.event);
  };

  const handleDateSelect = (selectInfo: any) => {
    // Handle date selection, e.g., open add task modal for selected date/time
    console.log('Date selected:', selectInfo);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Your schedule at a glance</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => calendarRef.current?.getApi().prev()}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => calendarRef.current?.getApi().next()}><ChevronRight className="h-4 w-4" /></Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2"><CalendarIcon className="h-4 w-4" />Jump to Date</Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    calendarRef.current?.getApi().gotoDate(date);
                  }
                }}
              />
            </PopoverContent>
          </Popover>
          <Dialog open={isTimeBlockModalOpen} onOpenChange={setIsTimeBlockModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2"><Clock className="h-4 w-4" />Editar Franjas</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedTimeBlock ? "Edit" : "Create"} Time Block</DialogTitle>
              </DialogHeader>
              <TimeBlockForm
                timeBlock={selectedTimeBlock}
                onClose={() => {
                  setIsTimeBlockModalOpen(false);
                  setSelectedTimeBlock(undefined);
                }}
              />
              <div className="mt-4">
                <h3 className="font-semibold">Existing Time Blocks</h3>
                <div className="space-y-2 mt-2">
                  {timeBlocks.map(tb => (
                    <div key={tb.id} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: tb.color }}>
                      <span>{tb.label}</span>
                      <div>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setSelectedTimeBlock(tb);
                          setIsTimeBlockModalOpen(true);
                        }}><Clock className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteTimeBlock(tb.id)}><Plus className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={handleZoomOut}><ZoomOut className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={handleZoomIn}><ZoomIn className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
        <div className="lg:col-span-2 h-full">
          <FullCalendar
            height="100%"
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            eventClick={handleEventClick}
            selectable={true}
            select={handleDateSelect}
            slotDuration={zoomLevels[zoomLevel].slotDuration}
            slotLabelInterval={zoomLevels[zoomLevel].slotLabelInterval}
            dayCellContent={(arg) => {
              return (
                <>
                  {arg.dayNumberText}
                  {getTasksForDate(arg.date).map(task => (
                    <div key={task.id} className={cn("w-full h-1.5 rounded-full", categoryColors[task.category])} />
                  ))}
                </>
              );
            }}
            eventContent={(arg) => {
              return (
                <div className="fc-event-main-frame">
                  <div className="fc-event-time">{arg.timeText}</div>
                  <div className="fc-event-title-container">
                    <div className="fc-event-title fc-sticky">{arg.event.title}</div>
                  </div>
                </div>
              );
            }}
          />
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
                <AddTaskForm 
                  onAddTask={handleAddTask} 
                  isOpen={isAddingTask} 
                  onToggle={() => setIsAddingTask(!isAddingTask)}
                  initialDate={selectedDate} // Pass the selectedDate here
                />
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
