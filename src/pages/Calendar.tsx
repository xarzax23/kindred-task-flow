import { useState, useRef, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Clock, ZoomIn, ZoomOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AddTaskForm } from "@/components/AddTaskForm";
import { cn } from "@/lib/utils";
import { useTasks } from "@/context/TaskContext";
import { useCategories } from "@/context/CategoryContext";
import { useCalendarEvents } from "@/context/CalendarEventContext";
import { useTimeBlocks } from "@/context/TimeBlockContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategoryForm } from "@/components/CategoryForm";
import { TimeBlockForm } from "@/components/TimeBlockForm";
import { Task, Category, CalendarEvent, TimeBlock } from "@/types";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { tasks, addTask, toggleTask } = useTasks();
  const { categories, addCategory, deleteCategory } = useCategories();
  const { calendarEvents, addCalendarEvent } = useCalendarEvents();
  const { timeBlocks, addTimeBlock, updateTimeBlock, deleteTimeBlock } = useTimeBlocks();

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
  const [isAddingTask, setIsAddingTask] = useState(false);

  const [isTimeBlockModalOpen, setIsTimeBlockModalOpen] = useState(false);
  const [selectedTimeBlock, setSelectedTimeBlock] = useState<TimeBlock | undefined>(undefined);

  const zoomLevels = [
    { slotDuration: '01:00:00', slotLabelInterval: '01:00:00' },
    { slotDuration: '00:30:00', slotLabelInterval: '00:30:00' },
    { slotDuration: '00:15:00', slotLabelInterval: '00:30:00' }
  ];
  const [zoomLevel, setZoomLevel] = useState(1);

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

  const events = useMemo(() => {
    const taskEvents = tasks.map(task => {
      const category = categories.find(c => c.id === task.categoryId);
      return {
        id: task.id,
        title: task.title,
        start: `${format(task.dueDate, 'yyyy-MM-dd')}T${task.startTime || '00:00:00'}`,
        end: task.endTime ? `${format(task.dueDate, 'yyyy-MM-dd')}T${task.endTime}` : undefined,
        color: category ? category.color : '#3788d8',
        extendedProps: { task },
      };
    });

    const calEvents = calendarEvents.map(ce => {
      const category = categories.find(c => c.id === ce.categoryId);
      return {
        id: ce.id,
        title: category ? category.label : 'Unnamed Event',
        start: ce.startTime.toISOString(),
        end: ce.endTime.toISOString(),
        color: category ? category.color : '#808080',
        display: 'background',
        extendedProps: { calendarEvent: ce },
      };
    });

    return [...taskEvents, ...calEvents];
  }, [tasks, categories, calendarEvents]);

  const handleEventClick = (clickInfo: any) => {
    console.log('Event clicked:', clickInfo.event);
  };

  const handleDateSelect = (selectInfo: any) => {
    const { start, end } = selectInfo;
    const newEvent: Omit<CalendarEvent, "id"> = {
      categoryId: "",
      startTime: start,
      endTime: end,
    };
    addCalendarEvent(newEvent);
  };

  const handleTimeBlockSubmit = (tb: Omit<TimeBlock, "id">) => {
    addTimeBlock(tb);
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
          {/* Manage Categories */}
          <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2"><Clock className="h-4 w-4" />Manage Categories</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedCategory ? "Edit" : "Create"} Category</DialogTitle>
              </DialogHeader>
              <CategoryForm
                category={selectedCategory}
                onClose={() => {
                  setIsCategoryModalOpen(false);
                  setSelectedCategory(undefined);
                }}
                onSubmit={addCategory}
              />
              <div className="mt-4">
                <h3 className="font-semibold">Existing Categories</h3>
                <div className="space-y-2 mt-2">
                  {categories.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: c.color }}>
                      <span>{c.label}</span>
                      <div>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setSelectedCategory(c);
                          setIsCategoryModalOpen(true);
                        }}><Clock className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteCategory(c.id)}><Plus className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
          {/* Manage Time Blocks */}
          <Dialog open={isTimeBlockModalOpen} onOpenChange={setIsTimeBlockModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2"><Clock className="h-4 w-4" />Manage Time Blocks</Button>
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
                onSubmit={(values) => handleTimeBlockSubmit(values)}
              />
              <div className="mt-4">
                <h3 className="font-semibold">Existing Time Blocks</h3>
                <div className="space-y-2 mt-2">
                  {timeBlocks.map(tb => {
                    const category = categories.find(c => c.id === tb.categoryId);
                    const days = tb.daysOfWeek && tb.daysOfWeek.length > 0
                      ? tb.daysOfWeek.sort().map(d => ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d]).join(", ")
                      : "Every day";
                    return (
                      <div key={tb.id} className="flex items-center justify-between p-2 rounded-lg bg-muted">
                        <span>{category ? category.label : "Uncategorised"}: {tb.startTime}-{tb.endTime} ({days})</span>
                        <div>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setSelectedTimeBlock(tb);
                            setIsTimeBlockModalOpen(true);
                          }}><Clock className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteTimeBlock(tb.id)}><Plus className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    );
                  })}
                  {timeBlocks.length === 0 && (
                    <div className="text-sm text-muted-foreground">No time blocks defined yet.</div>
                  )}
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
              const tasksForDate = getTasksForDate(arg.date);
              return (
                <>
                  {arg.dayNumberText}
                  <div className="flex flex-col items-center">
                    {tasksForDate.map(task => {
                      const category = categories.find(c => c.id === task.categoryId);
                      return (
                        <div key={task.id} className={cn("w-full h-1.5 rounded-full my-0.5", category ? `bg-[${category.color}]` : 'bg-gray-200')} style={{backgroundColor: category?.color}} />
                      )
                    })}
                  </div>
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
                  initialDate={selectedDate}
                />
              </div>
            )}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {getTasksForDate(selectedDate).map(task => {
                const category = categories.find(c => c.id === task.categoryId);
                return (
                  <div key={task.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} className="w-4 h-4 text-primary rounded focus:ring-primary" />
                      <span className={cn("font-medium text-sm flex-1", task.completed && "line-through text-muted-foreground")}>{task.title}</span>
                    </div>
                    <div className="flex items-center gap-2 ml-6">
                      <Badge variant="outline" style={{backgroundColor: category?.color}}>{category?.label}</Badge>
                      {(task.startTime || task.endTime) && (
                        <span className="text-xs text-muted-foreground">
                          {task.startTime && <span>{task.startTime}</span>}
                          {task.startTime && task.endTime && <span>-</span>}
                          {task.endTime && <span>{task.endTime}</span>}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
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
