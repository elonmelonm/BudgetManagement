'use client';

import { useState, useEffect } from 'react';
import { fetchTransactions, fetchCategories, deleteTransaction, fetchBudgets, createTransaction } from '@/services/api';
import { Card } from '@/components/ui/card';
import { Wallet, TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define the Transaction type
interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
}

export default function StatisticsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState([]);
  const [initialBudget, setInitialBudget] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [transactionsData, categoriesData, budgetResponse] = await Promise.all([
          fetchTransactions(),
          fetchCategories(),
          fetchBudgets(),
        ]);
        setTransactions(transactionsData);
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

  // Calcul des statistiques
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = initialBudget + totalIncome - totalExpenses;

  // Données pour le graphique
  const chartData = [
    { name: 'Revenus', value: totalIncome },
    { name: 'Dépenses', value: totalExpenses },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Wallet className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Solde actuel</p>
              <p className="text-2xl font-bold">
                {initialBudget.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Revenus totaux</p>
              <p className="text-2xl font-bold">
                {totalIncome.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <TrendingDown className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Dépenses totales</p>
              <p className="text-2xl font-bold">
                {totalExpenses.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Graphique des revenus et dépenses */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <BarChart2 className="h-8 w-8 text-primary" />
          <h2 className="text-xl font-semibold">Revenus vs Dépenses</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}