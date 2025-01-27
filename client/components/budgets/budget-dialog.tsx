'use client';

import { useState } from 'react';
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
import { createBudget } from '@/services/api'; // Import de la fonction API
import { useToast } from '@/hooks/use-toast'; // Import du hook Toast

const budgetSchema = z.object({
  initialAmount: z.string().min(1, 'Le montant est requis'),
});

interface BudgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBudgetCreated?: (budget: any) => void; // Callback pour notifier la création du budget
}

export function BudgetDialog({ open, onOpenChange, onBudgetCreated }: BudgetDialogProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false); // État pour gérer le chargement
  const form = useForm<z.infer<typeof budgetSchema>>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      initialAmount: '',
    },
  });

  async function onSubmit(data: z.infer<typeof budgetSchema>) {
    try {
      setIsLoading(true); // Active le chargement
      const initialAmount = parseFloat(data.initialAmount);
      const newBudget = await createBudget({ initialAmount });

      if (onBudgetCreated) {
        onBudgetCreated(newBudget);
      }

      toast({
        title: 'Budget créé avec succès',
        description: 'Votre budget a été enregistré.',
      });

      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
      });
    } finally {
      setIsLoading(false); // Désactive le chargement
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter le budget</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="initialAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                    />
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
                disabled={isLoading} // Désactive le bouton pendant le chargement
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}