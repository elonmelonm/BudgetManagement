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
import { fetchCategories, createRecurrence } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const reccurrenceSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  startDate: z.date(),
  endDate: z.date(),
  amount: z.string().min(1, 'Le montant est requis'),
  type: z.enum(['income', 'expense']),
  categoryId: z.string().min(1, 'La catégorie est requise'),
});

interface ReccurrenceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReccurrenceCreated: (reccurrence: any) => void; // Correction de la prop
}

export function ReccurrenceDialog({ open, onOpenChange, onReccurrenceCreated }: ReccurrenceDialogProps) {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof reccurrenceSchema>>({
    resolver: zodResolver(reccurrenceSchema),
    defaultValues: {
      name: '',
      frequency: 'weekly',
      startDate: new Date(),
      endDate: new Date(),
      amount: '',
      type: 'expense',
      categoryId: '',
    },
  });

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

  async function onSubmit(data: z.infer<typeof reccurrenceSchema>) {
    try {
      if (!data.categoryId) {
        throw new Error('Veuillez sélectionner une catégorie.');
      }

      const amount = parseFloat(data.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Le montant doit être un nombre positif.');
      }

      const startDate = data.startDate.toISOString().split('T')[0];
      const endDate = data.endDate.toISOString().split('T')[0];

      const newRecurrence = await createRecurrence({
        name: data.name,
        frequency: data.frequency,
        startDate: startDate,
        endDate: endDate,
        amount: amount,
        type: data.type,
        categoryId: data.categoryId,
      });

      if (onReccurrenceCreated) {
        onReccurrenceCreated(newRecurrence); // Utiliser la bonne prop
      }

      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Erreur lors de la création de la récurrence:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue lors de la création de la récurrence.',
        variant: 'destructive',
      });
    }
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouvelle récurrence</DialogTitle>
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
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fréquence</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner la fréquence" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Quotidienne</SelectItem>
                      <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      <SelectItem value="monthly">Mensuelle</SelectItem>
                      <SelectItem value="yearly">Annuelle</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de début</FormLabel>
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
                            <span>Choisir une date de début</span>
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
                        disabled={(date) => date < new Date()}
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
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de fin</FormLabel>
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
                            <span>Choisir une date de fin</span>
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
                        disabled={(date) => date < new Date()}
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
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" placeholder="0.00" />
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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