import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TimeBlock } from "@/types";
import { useTimeBlocks } from "@/context/TimeBlockContext";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTasks } from "@/context/TaskContext";

const timeBlockSchema = z.object({
  label: z.string().min(1, "Label is required"),
  date: z.date({ required_error: "A date is required." }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
});

interface TimeBlockFormProps {
  timeBlock?: TimeBlock;
  onClose: () => void;
}

export function TimeBlockForm({ timeBlock, onClose }: TimeBlockFormProps) {
  const { addTimeBlock, updateTimeBlock } = useTimeBlocks();
  const { tasks } = useTasks();
  const [customLabel, setCustomLabel] = useState("");

  const existingCategories = Array.from(new Set(tasks.map(task => task.category)));

  const form = useForm<z.infer<typeof timeBlockSchema>>({
    resolver: zodResolver(timeBlockSchema),
    defaultValues: timeBlock ? {
      label: existingCategories.includes(timeBlock.label) ? timeBlock.label : "other",
      date: timeBlock.startTime,
      startTime: format(timeBlock.startTime, "HH:mm"),
      endTime: format(timeBlock.endTime, "HH:mm"),
      color: timeBlock.color,
    } : {
      label: "",
      date: new Date(),
      startTime: "09:00",
      endTime: "17:00",
      color: "#3b82f6",
    },
  });

  const onSubmit = (values: z.infer<typeof timeBlockSchema>) => {
    const { date, startTime, endTime } = values;
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const finalStartTime = new Date(date.setHours(startHours, startMinutes));
    const finalEndTime = new Date(date.setHours(endHours, endMinutes));

    const finalLabel = values.label === "other" ? customLabel : values.label;

    if (timeBlock) {
      updateTimeBlock({ 
        ...timeBlock, 
        ...values,
        label: finalLabel,
        startTime: finalStartTime,
        endTime: finalEndTime,
      });
    } else {
      addTimeBlock({ 
        ...values,
        label: finalLabel,
        startTime: finalStartTime,
        endTime: finalEndTime,
      });
    }
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={(value) => {
                field.onChange(value);
                if (value !== "other") setCustomLabel("");
              }} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {existingCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                  <SelectItem value="other">Create New Category</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("label") === "other" && (
          <FormField
            control={form.control}
            name="customLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Category Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Learning" value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{timeBlock ? "Update" : "Create"}</Button>
      </form>
    </Form>
  );
}