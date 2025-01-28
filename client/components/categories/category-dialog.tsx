'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createCategory } from '@/services/api'; // Import the API function for creating a category

// Define the schema for the category form
const categorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'), // Name is required
});

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryCreated?: (newCategory: any) => void; // Callback function with the new category
}

export function CategoryDialog({ open, onOpenChange, onCategoryCreated }: CategoryDialogProps) {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '', // Default value for the name field
    },
  });

  // Handle form submission
  async function onSubmit(data: z.infer<typeof categorySchema>) {
    try {
      // Call the API to create a new category
      const newCategory = await createCategory({
        name: data.name, // Use the name from the form data
      });

      console.log('Catégorie créée avec succès:', newCategory);

      // Call the callback function if provided
      if (onCategoryCreated) {
        onCategoryCreated(newCategory);
      }

      // Close the dialog and reset the form
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie:', error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouvelle catégorie</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}