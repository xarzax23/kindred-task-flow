
import { useTasks } from "@/context/TaskContext";
import { isToday } from "date-fns";
import { TaskCard } from "@/components/TaskCard";

const DayView = () => {
  const { tasks, toggleTask } = useTasks();
  const todayTasks = tasks
    .filter(task => isToday(task.dueDate))
    .sort((a, b) => {
      if (a.startTime && b.startTime) {
        return a.startTime.localeCompare(b.startTime);
      }
      return 0;
    });

  const dayStartHour = 8;
  const dayEndHour = 22;

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  let lastTaskEndTime = dayStartHour * 60; // Start of the day in minutes

  const scheduleElements = [];

  todayTasks.forEach(task => {
    const taskStartTime = task.startTime ? timeToMinutes(task.startTime) : 0;
    const freeTimeDuration = taskStartTime - lastTaskEndTime;

    if (freeTimeDuration > 0) {
      scheduleElements.push(
        <div key={`free-${lastTaskEndTime}`} className="flex">
          <div className="w-16 text-right pr-4 text-gray-400">
            {`${Math.floor(lastTaskEndTime / 60).toString().padStart(2, '0')}:${(lastTaskEndTime % 60).toString().padStart(2, '0')}`}
          </div>
          <div className="flex-1 border-l-2 border-gray-200 pl-4 py-2">
            <div className="text-gray-400 italic">
              Free time ({freeTimeDuration} minutes)
            </div>
          </div>
        </div>
      );
    }

    scheduleElements.push(
      <div key={task.id} className="flex">
        <div className="w-16 text-right pr-4">{task.startTime}</div>
        <div className="flex-1 border-l-2 border-gray-200 pl-4">
          <TaskCard task={task} onToggleComplete={toggleTask} />
        </div>
      </div>
    );

    if (task.endTime) {
      lastTaskEndTime = timeToMinutes(task.endTime);
    }
  });

  const freeTimeAfterLastTask = dayEndHour * 60 - lastTaskEndTime;
  if (freeTimeAfterLastTask > 0) {
    scheduleElements.push(
      <div key="free-end" className="flex">
        <div className="w-16 text-right pr-4 text-gray-400">
          {`${Math.floor(lastTaskEndTime / 60).toString().padStart(2, '0')}:${(lastTaskEndTime % 60).toString().padStart(2, '0')}`}
        </div>
        <div className="flex-1 border-l-2 border-gray-200 pl-4 py-2">
          <div className="text-gray-400 italic">
            Free time ({freeTimeAfterLastTask} minutes)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Today's Schedule</h1>
      <div className="space-y-2">
        {scheduleElements}
      </div>
    </div>
  );
};

export default DayView;
