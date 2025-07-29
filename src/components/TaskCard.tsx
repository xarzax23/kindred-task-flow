import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
}

const categoryColors = {
  work: "bg-primary/10 text-primary border-primary/20",
  home: "bg-accent/10 text-accent-foreground border-accent/20",
  wellness: "bg-wellness/10 text-wellness border-wellness/20",
  personal: "bg-purple-100 text-purple-700 border-purple-200"
};

const priorityIcons = {
  low: null,
  medium: <Star className="h-3 w-3 text-amber-500" />,
  high: <Star className="h-3 w-3 text-red-500 fill-current" />
};

export function TaskCard({ task, onToggleComplete }: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggle = () => {
    setIsCompleting(true);
    setTimeout(() => {
      onToggleComplete(task.id);
      setIsCompleting(false);
    }, 300);
  };

  return (
    <Card 
      className={cn(
        "p-4 transition-all duration-300 hover:shadow-lg border-l-4",
        task.completed 
          ? "bg-muted/50 border-l-wellness opacity-70" 
          : "bg-card border-l-primary hover:border-l-primary-glow",
        isCompleting && "animate-task-complete"
      )}
    >
      <div className="flex items-center gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={handleToggle}
          className={cn(
            "h-5 w-5 transition-all duration-200",
            task.completed && "data-[state=checked]:bg-wellness data-[state=checked]:border-wellness"
          )}
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "font-medium text-sm",
              task.completed 
                ? "line-through text-muted-foreground" 
                : "text-foreground"
            )}>
              {task.title}
            </h3>
            {priorityIcons[task.priority]}
          </div>
          
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={cn("text-xs px-2 py-0.5", categoryColors[task.category])}
            >
              {task.category}
            </Badge>
            
            {(task.startTime || task.endTime) && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {task.startTime && <span>{task.startTime}</span>}
                {task.startTime && task.endTime && <span>-</span>}
                {task.endTime && <span>{task.endTime}</span>}
                {task.duration && <span>({task.duration} min)</span>}
              </div>
            )}
            {!task.startTime && !task.endTime && task.duration && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {task.duration} min
                </div>
            )}
          </div>
        </div>

        {task.completed && (
          <CheckCircle2 className="h-5 w-5 text-wellness animate-gentle-bounce" />
        )}
      </div>
    </Card>
  );
}