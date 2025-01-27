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
import { updateCategory } from '@/services/api';

const categorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
});

interface EditCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: { id: string; name: string };
  onCategoryUpdated: (updatedCategory: any) => void;
}

export function EditCategoryDialog({ open, onOpenChange, category, onCategoryUpdated }: EditCategoryDialogProps) {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category.name,
    },
  });

  async function onSubmit(data: z.infer<typeof categorySchema>) {
    try {
      const updatedCategory = await updateCategory(category.id, data);
      onCategoryUpdated(updatedCategory); // Mettre à jour la liste des catégories
      onOpenChange(false); // Fermer le dialogue
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie:', error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la catégorie</DialogTitle>
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