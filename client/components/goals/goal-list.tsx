'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { MoreHorizontal, Plus, Wallet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { GoalDialog } from './goal-dialog';
import { EditGoalDialog } from './editGoalDialog';
import { fetchGoals, deleteGoal } from '@/services/api';

interface GoalListProps {
  categories: any[];
  onDeleteGoal: (goalId: string) => void;
  onEditGoal: (goal: any) => void;
  onGoalCreated: (newGoal: any) => void;
  initialBudget: number;
  budgetId: string; // Ajout de la prop budgetId
}

export function GoalList({ 
  categories = [], // Ajouter une valeur par défaut
  onDeleteGoal, 
  onEditGoal, 
  onGoalCreated, 
  initialBudget,
  budgetId, // Destructure budgetId from props
}: GoalListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getGoals = async () => {
      try {
        setLoading(true);
        const data = await fetchGoals();
        setGoals(data);
        setError(null);
      } catch (err) {
        console.error('Erreur lors de la récupération des objectifs:', err);
        setError('Erreur lors de la récupération des objectifs');
      } finally {
        setLoading(false);
      }
    };

    getGoals();
  }, []);

  const handleGoalCreated = (newGoal: any) => {
    setGoals((prevGoals) => [...prevGoals, newGoal]);
    onGoalCreated(newGoal);
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
      setGoals((prevGoals) =>
        prevGoals.filter((goal) => goal.id !== goalId)
      );
      onDeleteGoal(goalId);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'objectif:', error);
    }
  };

  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal);
    setIsEditDialogOpen(true);
  };

  const handleGoalUpdated = (updatedGoal: any) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === updatedGoal.id ? updatedGoal : goal
      )
    );
    onEditGoal(updatedGoal);
  };

  return (
    <div>
      <div className="flex justify-between rounded-lg border bg-card shadow-sm p-2 mb-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-primary/10 p-3">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Solde total</p>
            <p className="text-2xl font-bold">
              {initialBudget.toLocaleString('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>
          </div>
        </div>
        <Button className='my-auto' onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel objectif
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Objectifs</h1>
      </div>

      {error && (
        <div className="text-red-500 text-center my-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center my-4">Chargement en cours...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Montant cible</TableHead>
              <TableHead>Date limite</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals && goals.length > 0 ? (
              goals.map((goal) => (
                <TableRow key={goal.id}>
                  <TableCell className="font-medium">
                    {goal.name}
                  </TableCell>
                  <TableCell>
                    {goal.targetAmount.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </TableCell>
                  <TableCell>
                    {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditGoal(goal)}>
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Aucun objectif trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <GoalDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onGoalCreated={handleGoalCreated}
        budgetId={budgetId} // Passage du budgetId
      />

      {selectedGoal && (
        <EditGoalDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          goal={selectedGoal}
          onGoalUpdated={handleGoalUpdated}
          budgetId={budgetId} // Pass the budgetId prop here
        />
      )}
    </div>
  );
}