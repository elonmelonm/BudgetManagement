'use client';

import { Card } from '@/components/ui/card';
import { ArrowUpCircle, ArrowDownCircle, Wallet, Target, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchBudgets, createBudget } from '@/services/api';
import { Button } from '@/components/ui/button';
import { BudgetDialog } from '@/components/budgets/budget-dialog';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
    activeGoals: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasBudget, setHasBudget] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const [header, payload, signature] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload.replace(/_/g, '/').replace(/-/g, '+')));
        const currentTime = Date.now() / 1000;

        if (decodedPayload.exp < currentTime) {
          localStorage.removeItem('token');
          router.push('/login');
        } else {
          setIsAuthorized(true);
          loadDashboardData(); // Charge les données du dashboard
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const budgetResponse = await fetchBudgets();

      if (budgetResponse.message === "Aucun budget trouvé pour cet utilisateur.") {
        setIsDialogOpen(true); // Affiche le BudgetDialog si aucun budget n'existe
      } else {
        setDashboardData({
          balance: budgetResponse.balance,
          income: budgetResponse.income,
          expenses: budgetResponse.expenses,
          activeGoals: budgetResponse.activeGoals,
        });
        setHasBudget(true); // Met à jour l'état pour indiquer qu'un budget existe
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBudgetCreated = async (initialAmount: number) => {
    try {
      const newBudget = await createBudget({ initialAmount });
      setDashboardData({
        balance: newBudget.balance,
        income: newBudget.income,
        expenses: newBudget.expenses,
        activeGoals: newBudget.activeGoals,
      });
      setHasBudget(true); // Met à jour l'état pour indiquer qu'un budget existe
      setIsDialogOpen(false); // Ferme la boîte de dialogue
      toast({
        title: 'Budget créé avec succès',
        description: 'Votre budget a été enregistré.',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
      });
    }
  };

  if (!isAuthorized) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Cartes de résumé */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Solde total</p>
              <p className="text-2xl font-bold">
                {dashboardData.balance.toLocaleString('fr-FR', {
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
              <ArrowUpCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenus du mois</p>
              <p className="text-2xl font-bold">
                {dashboardData.income.toLocaleString('fr-FR', {
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
              <ArrowDownCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dépenses du mois</p>
              <p className="text-2xl font-bold">
                {dashboardData.expenses.toLocaleString('fr-FR', {
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
              <p className="text-2xl font-bold">{dashboardData.activeGoals}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions récentes */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Transactions récentes</h2>
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      'rounded-full p-2',
                      transaction.montant > 0
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                    )}
                  >
                    {transaction.montant > 0 ? (
                      <ArrowUpCircle className="h-4 w-4" />
                    ) : (
                      <ArrowDownCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.categorie}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      'font-medium',
                      transaction.montant > 0 ? 'text-green-500' : 'text-red-500'
                    )}
                  >
                    {transaction.montant.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
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

      {/* Afficher le BudgetDialog si aucun budget n'existe */}
      {!budget && (
        <BudgetDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onBudgetCreated={handleBudgetCreated}
        />
      )}
    </div>
  );
}