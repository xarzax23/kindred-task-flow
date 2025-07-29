import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";

interface Task {
  id: string;
  title: string;
  category: "work" | "home" | "wellness" | "personal";
  priority: "low" | "medium" | "high";
  completed: boolean;
  dueDate: Date;
  startTime?: string;
  endTime?: string;
  duration: number;
}

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, "id" | "completed">) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function AddTaskForm({ onAddTask, isOpen, onToggle }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Task["category"]>("personal");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [duration, setDuration] = useState(30);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      category,
      priority,
      dueDate: new Date(),
      duration,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
    });

    // Reset form
    setTitle("");
    setCategory("personal");
    setPriority("medium");
    setDuration(30);
    setStartTime("");
    setEndTime("");
    onToggle();
  };

  if (!isOpen) {
    return (
      <Button 
        onClick={onToggle}
        className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add New Task
      </Button>
    );
  }

  return (
    <Card className="p-4 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary-glow/5 animate-fade-in">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-foreground">Add New Task</h3>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="task-title" className="text-sm font-medium">
            What would you like to accomplish?
          </Label>
          <Input
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Call dentist, Read 20 pages, Take a walk..."
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
                <Label htmlFor="start-time" className="text-sm font-medium">
                    Start Time (optional)
                </Label>
                <Input
                    id="start-time"
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-background/80"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="end-time" className="text-sm font-medium">
                    End Time (optional)
                </Label>
                <Input
                    id="end-time"
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="bg-background/80"
                />
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium">
                Duration (minutes)
            </Label>
            <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="bg-background/80"
            />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="submit" className="flex-1 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
          <Button type="button" variant="outline" onClick={onToggle}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}