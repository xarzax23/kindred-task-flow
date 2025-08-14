import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, X, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Task, Category } from "@/types";
import { useCategories } from "@/context/CategoryContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CategoryForm } from "./CategoryForm";

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, "id" | "completed">) => void;
  isOpen: boolean;
  onToggle: () => void;
  initialDate?: Date;
}

export function AddTaskForm({ onAddTask, isOpen, onToggle, initialDate }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const [duration, setDuration] = useState(30);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(initialDate || new Date());
  const { categories } = useCategories();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate || !categoryId) return;

    onAddTask({
      title: title.trim(),
      categoryId,
      priority,
      dueDate,
      duration,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
    });

    setTitle("");
    setCategoryId("");
    setPriority("medium");
    setDuration(30);
    setStartTime("");
    setEndTime("");
    setDueDate(initialDate || new Date());
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
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="bg-background/80">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>{category.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
              <DialogTrigger asChild>
                <Button variant="link" size="sm" className="p-0 h-auto">Create New Category</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Category</DialogTitle>
                </DialogHeader>
                <CategoryForm onClose={() => setIsCategoryModalOpen(false)} />
              </DialogContent>
            </Dialog>
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

        <div className="space-y-2">
          <Label htmlFor="due-date" className="text-sm font-medium">
            Due Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal bg-background/80",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
