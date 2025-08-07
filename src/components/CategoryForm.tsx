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
import { Category } from "@/types";
import { useCategories } from "@/context/CategoryContext";

const categorySchema = z.object({
  label: z.string().min(1, "Label is required"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a valid hex color"),
});

interface CategoryFormProps {
  category?: Category;
  onClose: () => void;
  onSubmit: (values: Omit<Category, "id">) => void;
}

export function CategoryForm({ category, onClose, onSubmit }: CategoryFormProps) {
  const { updateCategory } = useCategories();

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: category ? category : {
      label: "",
      color: "#3b82f6",
    },
  });

  const handleFormSubmit = (values: z.infer<typeof categorySchema>) => {
    if (category) {
      updateCategory({ 
        ...category, 
        ...values,
      });
    } else {
      onSubmit(values);
    }
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Learning" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button type="submit">{category ? "Update" : "Create"}</Button>
      </form>
    </Form>
  );
}