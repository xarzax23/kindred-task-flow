import { useState, useEffect } from "react";
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
import { Task } from "@/types";
import { useCategories } from "@/context/CategoryContext";
import { useTimeBlocks } from "@/context/TimeBlockContext";
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
  const { getTimeBlocksForCategory } = useTimeBlocks();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Autocompletar horas según la franja y el día seleccionado
  useEffect(() => {
    if (categoryId && dueDate) {
      const blocks = getTimeBlocksForCategory(categoryId);
      const dow = dueDate.getDay(); // 0=domingo, 6=sábado
      const match = blocks.find(
        (b) => !b.daysOfWeek || b.daysOfWeek.length === 0 || b.daysOfWeek.includes(dow)
      );
      if (match) {
        setStartTime(match.startTime);
        setEndTime(match.endTime);
      }
    }
  }, [categoryId, dueDate, getTimeBlocksForCategory]);

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

  // Resto de la interfaz del formulario (sin cambios)
  // Puedes reutilizar el HTML que tenías anteriormente para los campos de título,
  // categoría, prioridad, fecha, horas y duración.

  // ... (continúa igual que la versión anterior del formulario)
}
