'use client';

import { useState, useEffect } from 'react';
import { fetchRecurrences, fetchCategories, deleteRecurrence, fetchBudgets, createRecurrence } from '@/services/api';
import { ReccurrenceList } from '@/components/reccurrences/reccurrence-list';
import { EditReccurrenceDialog } from '@/components/reccurrences/editReccurrenceDialog';
import { Card } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

export default function ReccurrencesPage() {
  const [reccurrences, setReccurrences] = useState([]); // Remplacez transactions par reccurrences
  const [categories, setCategories] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReccurrence, setSelectedReccurrence] = useState(null); // Remplacez selectedTransaction par selectedReccurrence
  const [initialBudget, setInitialBudget] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reccurrencesData, categoriesData, budgetResponse] = await Promise.all([
          fetchRecurrences(), // Remplacez fetchTransactions par fetchRecurrences
          fetchCategories(),
          fetchBudgets(),
        ]);
        setReccurrences(reccurrencesData); // Remplacez transactions par reccurrences
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

  const handleEditClick = (reccurrence) => {
    setSelectedReccurrence(reccurrence); // Remplacez selectedTransaction par selectedReccurrence
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

        await deleteRecurrence(reccurrenceId); // Remplacez deleteTransaction par deleteRecurrence
        setReccurrences((prevReccurrences) =>
          prevReccurrences.filter((reccurrence) => reccurrence.id !== reccurrenceId)
        ); // Remplacez transactions par reccurrences
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la récurrence:', error);
    }
  };

  const handleReccurrenceUpdate = (updatedReccurrence) => {
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
      ); // Remplacez transactions par reccurrences
    });
  };

  const handleReccurrenceCreated = (newReccurrence) => {
    // Ajouter la nouvelle récurrence à la liste
    setReccurrences((prevReccurrences) => [...prevReccurrences, newReccurrence]); // Remplacez transactions par reccurrences

    // Mettre à jour le solde en fonction du type de récurrence
    if (newReccurrence.type === 'income') {
      setInitialBudget((prevBudget) => prevBudget + newReccurrence.amount);
    } else {
      setInitialBudget((prevBudget) => prevBudget - newReccurrence.amount);
    }
  };

  return (
    <div className="space-y-8">
      {/* Liste des récurrences */}
      <ReccurrenceList
        reccurrences={reccurrences} // Remplacez transactions par reccurrences
        categories={categories}
        onDeleteReccurrence={handleDeleteReccurrence} // Remplacez onDeleteTransaction par onDeleteReccurrence
        onEditReccurrence={handleEditClick} // Remplacez onEditTransaction par onEditReccurrence
        onReccurrenceCreated={handleReccurrenceCreated} // Remplacez onTransactionCreated par onReccurrenceCreated
        initialBudget={initialBudget}
      />

      {/* Dialogue pour éditer une récurrence */}
      {selectedReccurrence && (
        <EditReccurrenceDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          reccurrence={selectedReccurrence} // Remplacez transaction par reccurrence
          onReccurrenceUpdated={handleReccurrenceUpdate} // Remplacez onTransactionUpdated par onReccurrenceUpdated
        />
      )}
    </div>
  );
}