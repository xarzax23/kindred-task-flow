import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Category, TimeBlock } from "@/types";
import { useCategories } from "@/context/CategoryContext";
import { useTimeBlocks } from "@/context/TimeBlockContext";

const DAYS = [
  { id: 0, label: "Sun" },
  { id: 1, label: "Mon" },
  { id: 2, label: "Tue" },
  { id: 3, label: "Wed" },
  { id: 4, label: "Thu" },
  { id: 5, label: "Fri" },
  { id: 6, label: "Sat" },
];

const schema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "HH:MM"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "HH:MM"),
  daysOfWeek: z.array(z.number()).min(1, { message: "Select at least one day" }),
});

interface Props {
  timeBlock?: TimeBlock;
  onClose: () => void;
  onSubmit?: (tb: Omit<TimeBlock, "id">) => void;
}

export function TimeBlockForm({ timeBlock, onClose, onSubmit }: Props) {
  const { categories } = useCategories();
  const { addTimeBlock, updateTimeBlock } = useTimeBlocks();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: timeBlock
      ? {
          categoryId: timeBlock.categoryId,
          startTime: timeBlock.startTime,
          endTime: timeBlock.endTime,
          daysOfWeek: timeBlock.daysOfWeek ?? [],
        }
      : {
          categoryId: "",
          startTime: "19:00",
          endTime: "20:00",
          daysOfWeek: [],
        },
  });

  const handleSubmit = (values: z.infer<typeof schema>) => {
    if (timeBlock) {
      updateTimeBlock({ ...timeBlock, ...values });
    } else if (onSubmit) {
      onSubmit(values);
    } else {
      addTimeBlock(values);
    }
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                      {categories.map((c: Category) => (
                        <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
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
        <FormField
          control={form.control}
          name="daysOfWeek"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Days of the Week</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((d) => (
                    <label key={d.id} className="flex items-center gap-1">
                      <Checkbox
                        checked={field.value.includes(d.id)}
                        onCheckedChange={(checked) => {
                          const current = field.value || [];
                          if (checked) {
                            field.onChange([...current, d.id]);
                          } else {
                            field.onChange(current.filter((x) => x !== d.id));
                          }
                        }}
                      />
                      <span>{d.label}</span>
                    </label>
                  ))}
                </div>
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
