'use client';

import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchCategories, updateTransaction } from '@/services/api';

const transactionSchema = z.object({
  name: z.string().min(1, 'La description est requise'),
  amount: z.string().min(1, 'Le montant est requis'),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1, 'La catégorie est requise'),
  date: z.date(),
});

interface EditTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: any;
  onTransactionUpdated: (updatedTransaction: any) => void;
}

export function EditTransactionDialog({ 
  open, 
  onOpenChange, 
  transaction, 
  onTransactionUpdated 
}: EditTransactionDialogProps) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    };

    loadCategories();
  }, []);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      name: transaction.name,
      amount: transaction.amount.toString(),
      type: transaction.type,
      categoryId: transaction.category.id,
      date: new Date(transaction.date),
    },
  });

  async function onSubmit(data: z.infer<typeof transactionSchema>) {
    try {
      const updatedTransaction = await updateTransaction(transaction.id, {
        name: data.name,
        amount: parseFloat(data.amount),
        type: data.type,
        categoryId: data.categoryId,
        date: data.date.toISOString(),
      });

      onTransactionUpdated(updatedTransaction);
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la transaction:', error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la transaction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income">Revenu</SelectItem>
                      <SelectItem value="expense">Dépense</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: fr })
                          ) : (
                            <span>Choisir une date</span>
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
                        disabled={(date) => date > new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select
                    onValueChange={field.onChange}
                    defaultValue={transaction.category.id} // Valeur par défaut basée sur la catégorie actuelle
                >
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                        {category.name}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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