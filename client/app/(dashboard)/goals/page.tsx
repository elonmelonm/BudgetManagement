'use client';

import { useState, useEffect } from 'react';
import { fetchGoals, fetchBudgets, fetchCategories } from '@/services/api';
import { GoalList } from '@/components/goals/goal-list';

export default function GoalsPage() {
  const [goals, setGoals] = useState([]);
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

  const handleGoalCreated = (newGoal: any) => {
    setGoals((prevGoals) => [...prevGoals, newGoal]);
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
  };

  const handleEditGoal = (updatedGoal: any) => {
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