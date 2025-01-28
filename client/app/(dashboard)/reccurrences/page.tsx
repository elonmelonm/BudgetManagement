'use client';

import { useState, useEffect } from 'react';
import { fetchRecurrences, fetchCategories, deleteRecurrence, fetchBudgets, createRecurrence } from '@/services/api';
import { ReccurrenceList } from '@/components/reccurrences/reccurrence-list';
import { EditReccurrenceDialog } from '@/components/reccurrences/editReccurrenceDialog';
import { Card } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

// Define the Reccurrence interface
interface Reccurrence {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  // Add other properties as needed
}

export default function ReccurrencesPage() {
  const [reccurrences, setReccurrences] = useState<Reccurrence[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // Use `any[]` or define a proper type for categories
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReccurrence, setSelectedReccurrence] = useState<Reccurrence | null>(null);
  const [initialBudget, setInitialBudget] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reccurrencesData, categoriesData, budgetResponse] = await Promise.all([
          fetchRecurrences(),
          fetchCategories(),
          fetchBudgets(),
        ]);
        setReccurrences(reccurrencesData);
        setCategories(categoriesData);

        if (budgetResponse && budgetResponse.initialAmount) {
          setInitialBudget(budgetResponse.initialAmount);
        } else {
          setInitialBudget(0);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    loadData();
  }, []);

  const handleEditClick = (reccurrence: Reccurrence) => {
    setSelectedReccurrence(reccurrence);
    setIsEditDialogOpen(true);
  };

  const handleDeleteReccurrence = async (reccurrenceId: string) => {
    try {
      const reccurrenceToDelete = reccurrences.find((r) => r.id === reccurrenceId);

      if (reccurrenceToDelete) {
        if (reccurrenceToDelete.type === 'income') {
          setInitialBudget((prevBudget) => prevBudget - reccurrenceToDelete.amount);
        } else {
          setInitialBudget((prevBudget) => prevBudget + reccurrenceToDelete.amount);
        }

        await deleteRecurrence(reccurrenceId);
        setReccurrences((prevReccurrences) =>
          prevReccurrences.filter((reccurrence) => reccurrence.id !== reccurrenceId)
        );
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la récurrence:', error);
    }
  };

  const handleReccurrenceUpdate = (updatedReccurrence: Reccurrence) => {
    setReccurrences((prevReccurrences) => {
      const oldReccurrence = prevReccurrences.find((r) => r.id === updatedReccurrence.id);

      if (oldReccurrence) {
        if (oldReccurrence.type === 'income') {
          setInitialBudget((prevBudget) => prevBudget - oldReccurrence.amount);
        } else {
          setInitialBudget((prevBudget) => prevBudget + oldReccurrence.amount);
        }

        if (updatedReccurrence.type === 'income') {
          setInitialBudget((prevBudget) => prevBudget + updatedReccurrence.amount);
        } else {
          setInitialBudget((prevBudget) => prevBudget - updatedReccurrence.amount);
        }
      }

      return prevReccurrences.map((reccurrence) =>
        reccurrence.id === updatedReccurrence.id ? updatedReccurrence : reccurrence
      );
    });
  };

  const handleReccurrenceCreated = (newReccurrence: Reccurrence) => {
    setReccurrences((prevReccurrences) => [...prevReccurrences, newReccurrence]);

    if (newReccurrence.type === 'income') {
      setInitialBudget((prevBudget) => prevBudget + newReccurrence.amount);
    } else {
      setInitialBudget((prevBudget) => prevBudget - newReccurrence.amount);
    }
  };

  return (
    <div className="space-y-8">
      {/* ReccurrenceList component */}
      <ReccurrenceList
        reccurrences={reccurrences} // Ensure this prop is defined in ReccurrenceListProps
        categories={categories}
        onDeleteReccurrence={handleDeleteReccurrence}
        onEditReccurrence={handleEditClick}
        onReccurrenceCreated={handleReccurrenceCreated}
        initialBudget={initialBudget}
      />

      {/* EditReccurrenceDialog component */}
      {selectedReccurrence && (
        <EditReccurrenceDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          reccurrence={selectedReccurrence}
          onReccurrenceUpdated={handleReccurrenceUpdate}
        />
      )}
    </div>
  );
}