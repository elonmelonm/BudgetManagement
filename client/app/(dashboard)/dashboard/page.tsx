import { Card } from '@/components/ui/card';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
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
              <p className="text-2xl font-bold">3 250,00 €</p>
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
              <p className="text-2xl font-bold">2 800,00 €</p>
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
              <p className="text-2xl font-bold">1 450,00 €</p>
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
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions récentes */}
      <Card>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Transactions récentes</h2>
          <div className="space-y-4">
            {[
              {
                id: 1,
                description: 'Courses Carrefour',
                montant: -85.50,
                date: '2024-03-20',
                categorie: 'Alimentation'
              },
              {
                id: 2,
                description: 'Salaire',
                montant: 2800,
                date: '2024-03-15',
                categorie: 'Revenu'
              },
              {
                id: 3,
                description: 'Netflix',
                montant: -15.99,
                date: '2024-03-14',
                categorie: 'Loisirs'
              }
            ].map((transaction) => (
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
    </div>
  );
}