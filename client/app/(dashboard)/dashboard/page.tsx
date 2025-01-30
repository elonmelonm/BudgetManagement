'use client';

import { Card } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle, Wallet, Target, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SetStateAction, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchBudgets, fetchTransactions, fetchStatistics } from '@/services/api';
import { BudgetDialog } from '@/components/budgets/budget-dialog';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

// Définir le type pour une transaction
type Transaction = {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [initialBudget, setInitialBudget] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Typage de l'état transactions
  const [statistics, setStatistics] = useState({ totalIncome: 0, totalExpense: 0 });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(
          atob(payload.replace(/_/g, '/').replace(/-/g, '+'))
        );

        const currentTime = Date.now() / 1000;
        if (decodedPayload.exp < currentTime) {
          localStorage.removeItem('token');
          router.push('/login'); // Redirection immédiate si le token est expiré
          return; // Arrête l'exécution du code ici pour éviter de continuer
        } else {
          setIsAuthorized(true);
          loadBudget();
          loadTransactions();
          loadStatistics();
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        router.push('/login'); // Redirection en cas d'erreur de token
      }
    } else {
      router.push('/login'); // Redirection si aucun token n'est trouvé
    }
  }, [router]);

  const loadBudget = async () => {
    setIsLoading(true);
    try {
      const budgetResponse = await fetchBudgets();
      if (budgetResponse && budgetResponse.initialAmount) {
        setInitialBudget(budgetResponse.initialAmount);
      } else if (budgetResponse.message === "Aucun budget trouvé pour cet utilisateur.") {
        setInitialBudget(0);
        setIsDialogOpen(true);
      }
    } catch (error) {
      console.error('Failed to load budget:', error);
      setInitialBudget(0);
      setIsDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const transactionsResponse = await fetchTransactions();
      setTransactions(transactionsResponse);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      const statisticsResponse = await fetchStatistics();
      setStatistics({
        totalIncome: statisticsResponse.totalIncome || 0,
        totalExpense: statisticsResponse.totalExpense || 0,
      });
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleBudgetCreated = (newBudget: { initialAmount: SetStateAction<number>; }) => {
    setInitialBudget(newBudget.initialAmount);
    setIsDialogOpen(false);
    toast({
      title: 'Budget créé avec succès',
      description: 'Votre budget a été enregistré.',
    });
  };

  if (!isAuthorized || isLoading) {
    return <div>Loading...</div>;
  }

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-8">
      {!initialBudget && (
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Budget</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter le budget
          </Button>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
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
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-green-500/10 p-3">
              <ArrowDownCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total des Revenus</p>
              <p className="text-2xl font-bold">
                {statistics.totalIncome.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-red-500/10 p-3">
              <ArrowUpCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total des Dépenses</p>
              <p className="text-2xl font-bold">
                {statistics.totalExpense.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-blue-500/10 p-3">
              <Target className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Objectifs actifs</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Transactions récentes</h2>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'rounded-full p-2',
                      transaction.type === 'income'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                    )}
                  >
                    {transaction.type === 'income' ? (
                      <ArrowDownCircle className="h-4 w-4" />
                    ) : (
                      <ArrowUpCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      'font-medium',
                      transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                    )}
                  >
                    {transaction.amount.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <BudgetDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onBudgetCreated={handleBudgetCreated}
      />
    </div>
  );
}