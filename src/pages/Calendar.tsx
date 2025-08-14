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
import { Task, Category, CalendarEvent } from "@/types";
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

  // ... resto de variables zoom, calendarRef, etc. igual que antes

  // UI y lógicas de Manage Time Blocks
  return (
    // ...
    <div className="flex gap-2">
      {/* Botón de categorías */}
      {/* ... aquí va el botón de Manage Categories ... */}

      {/* Botón de franjas de tiempo */}
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
            onSubmit={(values) => addTimeBlock(values)}
          />
          <div className="mt-4">
            <h3 className="font-semibold">Existing Time Blocks</h3>
            <div className="space-y-2 mt-2">
              {timeBlocks.map(tb => {
                const category = categories.find(c => c.id === tb.categoryId);
                const days = tb.daysOfWeek?.length
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

      {/* Resto de botones: Zoom, etc. */}
    </div>
    // ...
  );
}
