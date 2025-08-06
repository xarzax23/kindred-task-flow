import { useTasks } from "@/context/TaskContext";
import { useTimeBlocks } from "@/context/TimeBlockContext";
import { isSameDay, format } from "date-fns";
import { TaskCard } from "@/components/TaskCard";

interface DayViewProps {
  selectedDate: Date;
  hourHeight: number; // New prop for hour height
}

const DayView = ({ selectedDate, hourHeight }: DayViewProps) => {
  const { tasks, toggleTask, updateTask } = useTasks();
  const { timeBlocks } = useTimeBlocks();

  const dayTasks = tasks.filter(task => isSameDay(task.dueDate, selectedDate));
  const dayTimeBlocks = timeBlocks.filter(tb => isSameDay(tb.startTime, selectedDate));

  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-4 p-4">
      {/* Time Axis */}
      <div className="flex flex-col">
        {timeSlots.map(slot => (
          <div key={slot} className="text-right pr-2 text-sm text-muted-foreground" style={{ height: `${hourHeight}px` }}>{slot}</div>
        ))}
      </div>

      {/* Day Grid */}
      <div className="relative border-l">
        {/* Time Blocks */}
        {dayTimeBlocks.map(tb => (
          <div
            key={tb.id}
            className="absolute w-full rounded-lg -z-10"
            style={{
              backgroundColor: tb.color,
              top: `${(timeToMinutes(format(tb.startTime, "HH:mm"))) / 60 * hourHeight}px`,
              height: `${(timeToMinutes(format(tb.endTime, "HH:mm")) - timeToMinutes(format(tb.startTime, "HH:mm"))) / 60 * hourHeight}px`,
            }}
          />
        ))}
        {/* Tasks */}
        {dayTasks.map(task => (
          <div 
            key={task.id}
            className="absolute w-full"
            style={{
              top: `${(timeToMinutes(task.startTime || '00:00')) / 60 * hourHeight}px`,
              height: `${task.duration / 60 * hourHeight}px`
            }}
          >
            <TaskCard task={task} onToggleComplete={toggleTask} onUpdateTask={updateTask} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayView;