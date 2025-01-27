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
import { createCategory } from '@/services/api'; // Import de la fonction API

const categorySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
});

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryCreated?: (newCategory: any) => void; // Fonction de rappel avec la nouvelle catégorie
}

export function CategoryDialog({ open, onOpenChange, onCategoryCreated }: CategoryDialogProps) {
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
    },
  });

  async function onSubmit(data: z.infer<typeof transactionSchema>) {
    try {
      // Convertir le montant en nombre
      const amount = parseFloat(data.montant);
  
      // Formater la date au format ISO 8601
      const formattedDate = data.date.toISOString();
  
      // Appel API pour créer une nouvelle transaction
      const newTransaction = await createTransaction({
        name: data.description, // Utilisez 'description' comme 'name'
        amount: amount,
        date: formattedDate, // Date au format ISO 8601
        type: data.type,
        categoryId: data.categoryId, // Utilisez 'categoryId'
      });
  
      console.log('Transaction créée avec succès:', newTransaction);
  
      // Fermer le dialogue et réinitialiser le formulaire
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Erreur lors de la création de la transaction:', error);
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