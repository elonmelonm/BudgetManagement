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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createGoal } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const goalSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  targetAmount: z.string().min(1, 'Le montant cible est requis'),
  deadline: z.date(),
});

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreated: (goal: any) => void;
  budgetId: string;
}

export function GoalDialog({ 
  open, 
  onOpenChange, 
  onGoalCreated,
  budgetId,
}: GoalDialogProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: '',
      targetAmount: '',
      deadline: new Date(),
    },
  });

  async function onSubmit(data: z.infer<typeof goalSchema>) {
    try {
      // Formatage de la date au format YYYY-MM-DD
      const formattedDate = data.deadline.toISOString().split('T')[0];
      
      const newGoal = await createGoal({
        name: data.name,
        targetAmount: parseFloat(data.targetAmount),
        deadline: formattedDate,
        budgetId: budgetId, // Utilisation du budgetId passé en prop
      });

      if (onGoalCreated) {
        onGoalCreated(newGoal);
      }

      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Erreur lors de la création de l\'objectif:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue lors de la création de l\'objectif.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouvel objectif</DialogTitle>
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
              name="targetAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant cible</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" placeholder="0.00" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date limite</FormLabel>
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
                            <span>Choisir une date limite</span>
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