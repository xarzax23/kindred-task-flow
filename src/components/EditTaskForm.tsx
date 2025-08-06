import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Task } from "@/types";

interface EditTaskFormProps {
  task: Task;
  onUpdateTask: (task: Task) => void;
}

export function EditTaskForm({ task, onUpdateTask }: EditTaskFormProps) {
  const [title, setTitle] = useState(task.title);
  const [category, setCategory] = useState<Task["category"]>(task.category);
  const [priority, setPriority] = useState<Task["priority"]>(task.priority);
  const [duration, setDuration] = useState(task.duration);
  const [startTime, setStartTime] = useState(task.startTime || "");
  const [endTime, setEndTime] = useState(task.endTime || "");

  useEffect(() => {
    setTitle(task.title);
    setCategory(task.category);
    setPriority(task.priority);
    setDuration(task.duration);
    setStartTime(task.startTime || "");
    setEndTime(task.endTime || "");
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onUpdateTask({
      ...task,
      title: title.trim(),
      category,
      priority,
      duration,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="edit-task-title" className="text-sm font-medium">
          Task Title
        </Label>
        <Input
          id="edit-task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-background/80"
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Category</Label>
          <Select value={category} onValueChange={(value: Task["category"]) => setCategory(value)}>
            <SelectTrigger className="bg-background/80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="work">🏢 Work</SelectItem>
              <SelectItem value="home">🏠 Home</SelectItem>
              <SelectItem value="wellness">🌱 Wellness</SelectItem>
              <SelectItem value="personal">👤 Personal</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Priority</Label>
          <Select value={priority} onValueChange={(value: Task["priority"]) => setPriority(value)}>
            <SelectTrigger className="bg-background/80">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
              <Label htmlFor="edit-start-time" className="text-sm font-medium">
                  Start Time (optional)
              </Label>
              <Input
                  id="edit-start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-background/80"
              />
          </div>
          <div className="space-y-2">
              <Label htmlFor="edit-end-time" className="text-sm font-medium">
                  End Time (optional)
              </Label>
              <Input
                  id="edit-end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-background/80"
              />
          </div>
      </div>

      <div className="space-y-2">
          <Label htmlFor="edit-duration" className="text-sm font-medium">
              Duration (minutes)
          </Label>
          <Input
              id="edit-duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="bg-background/80"
          />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary">
          Save Changes
        </Button>
      </div>
    </form>
  );
}