'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpCircle, ArrowDownCircle, MoreHorizontal, Plus, Wallet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { TransactionDialog } from './transaction-dialog';

interface TransactionListProps {
  transactions: any[];
  categories: any[];
  onDeleteTransaction: (transactionId: string) => void;
  onEditTransaction: (transaction: any) => void;
  onTransactionCreated: (newTransaction: any) => void;
  initialBudget: number; // Ajoutez cette ligne pour recevoir le budget initial
}

export function TransactionList({ 
  transactions, 
  categories, 
  onDeleteTransaction, 
  onEditTransaction,
  onTransactionCreated,
  initialBudget, // Ajoutez cette ligne
}: TransactionListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div>
      {/* Afficher le solde */}
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
          Nouvelle transaction
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Catégorie</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'rounded-full p-2',
                      transaction.type === 'income'
                        ? 'bg-green-500/10 text-green-500'
                        : 'bg-red-500/10 text-red-500'
                    )}
                  >
                    {transaction.type === 'income' ? (
                      <ArrowUpCircle className="h-4 w-4" />
                    ) : (
                      <ArrowDownCircle className="h-4 w-4" />
                    )}
                  </div>
                  {transaction.name}
                </div>
              </TableCell>
              <TableCell>
                {transaction.category.name}
              </TableCell>
              <TableCell>
                {new Date(transaction.date).toLocaleDateString('fr-FR')}
              </TableCell>
              <TableCell>
                {transaction.type}
              </TableCell>
              <TableCell
                className={cn(
                  'text-right font-medium',
                  transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
                )}
              >
                {transaction.amount.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEditTransaction(transaction)}>
                      Modifier
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDeleteTransaction(transaction.id)}
                    >
                      Supprimer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onTransactionCreated={onTransactionCreated} // Passez la fonction de rappel
      />
    </div>
  );
}