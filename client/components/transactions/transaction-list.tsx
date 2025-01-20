'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowUpCircle, ArrowDownCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const transactions = [
  {
    id: 1,
    description: 'Courses Carrefour',
    montant: -85.5,
    date: '2024-03-20',
    categorie: 'Alimentation',
  },
  {
    id: 2,
    description: 'Salaire',
    montant: 2800,
    date: '2024-03-15',
    categorie: 'Revenu',
  },
  {
    id: 3,
    description: 'Netflix',
    montant: -15.99,
    date: '2024-03-14',
    categorie: 'Loisirs',
  },
];

export function TransactionList() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Catégorie</TableHead>
          <TableHead>Date</TableHead>
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
                {transaction.description}
              </div>
            </TableCell>
            <TableCell>{transaction.categorie}</TableCell>
            <TableCell>
              {new Date(transaction.date).toLocaleDateString('fr-FR')}
            </TableCell>
            <TableCell
              className={cn(
                'text-right font-medium',
                transaction.montant > 0 ? 'text-green-500' : 'text-red-500'
              )}
            >
              {transaction.montant.toLocaleString('fr-FR', {
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
                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}