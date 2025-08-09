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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category, TimeBlock } from "@/types";
import { useCategories } from "@/context/CategoryContext";
import { useTimeBlocks } from "@/context/TimeBlockContext";

const timeBlockSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Must be a valid HH:MM time"),
  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Must be a valid HH:MM time"),
});

interface TimeBlockFormProps {
  /** Existing time block to edit, if any */
  timeBlock?: TimeBlock;
  /** Called when the modal/form should be closed */
  onClose: () => void;
  /** Called with the new or updated time block */
  onSubmit?: (values: Omit<TimeBlock, "id">) => void;
}

/**
 * Form for creating or editing a TimeBlock.  Allows the user to select
 * a category, start time and end time.  Validation is performed using
 * zod to ensure the times are valid HH:MM strings.  When submitted,
 * either calls the provided onSubmit callback (for creating new
 * blocks) or updates the existing block via useTimeBlocks.
 */
export function TimeBlockForm({ timeBlock, onClose, onSubmit }: TimeBlockFormProps) {
  const { categories } = useCategories();
  const { updateTimeBlock, addTimeBlock } = useTimeBlocks();

  const form = useForm<z.infer<typeof timeBlockSchema>>({
    resolver: zodResolver(timeBlockSchema),
    defaultValues: timeBlock
      ? {
          categoryId: timeBlock.categoryId,
          startTime: timeBlock.startTime,
          endTime: timeBlock.endTime,
        }
      : {
          categoryId: "",
          startTime: "19:00",
          endTime: "20:00",
        },
  });

  const handleFormSubmit = (values: z.infer<typeof timeBlockSchema>) => {
    if (timeBlock) {
      // editing existing
      updateTimeBlock({ ...timeBlock, ...values });
    } else {
      if (onSubmit) {
        onSubmit(values);
      } else {
        addTimeBlock(values);
      }
    }
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: Category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
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
            <FormItem>
              <FormLabel>End Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
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