'use client';

import { useState, useEffect } from 'react';
import { fetchGoals, fetchBudgets, fetchCategories } from '@/services/api';
import { GoalList } from '@/components/goals/goal-list';

// Définir le type pour un objectif (goal)
type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  // Ajoutez d'autres propriétés si nécessaire
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]); // Typage de l'état goals
  const [initialBudget, setInitialBudget] = useState<number>(0);
  const [budgetId, setBudgetId] = useState<string>('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [goalsData, budgetResponse, categoriesData] = await Promise.all([
          fetchGoals(),
          fetchBudgets(),
          fetchCategories(),
        ]);
        setGoals(goalsData);
        setCategories(categoriesData);

        if (budgetResponse) {
          setInitialBudget(budgetResponse.initialAmount);
          setBudgetId(budgetResponse.id); // Stockage de l'ID du budget
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    loadData();
  }, []);

  const handleGoalCreated = (newGoal: Goal) => {
    setGoals((prevGoals) => [...prevGoals, newGoal]);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
  };

  const handleEditGoal = (updatedGoal: Goal) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal))
    );
  };

  return (
    <div className="space-y-8">
      <GoalList
        categories={categories}
        onDeleteGoal={handleDeleteGoal}
        onEditGoal={handleEditGoal}
        onGoalCreated={handleGoalCreated}
        initialBudget={initialBudget}
        budgetId={budgetId}
      />
    </div>
  );
}