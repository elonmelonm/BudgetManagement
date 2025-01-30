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
import { useState, useEffect } from 'react';
import { ReccurrenceDialog } from './reccurrence-dialog';
import { EditReccurrenceDialog } from './editReccurrenceDialog';
import { fetchRecurrences, deleteRecurrence } from '@/services/api';

interface ReccurrenceListProps {
  categories: any[];
  onDeleteReccurrence: (reccurrenceId: string) => void;
  onEditReccurrence: (reccurrence: any) => void;
  onReccurrenceCreated: (newReccurrence: any) => void;
  initialBudget: number;
  reccurrences: any[]; // Add this line
}

export function ReccurrenceList({ 
  categories, 
  onDeleteReccurrence, 
  onEditReccurrence, 
  onReccurrenceCreated, 
  initialBudget,
  reccurrences, // Add this line
}: ReccurrenceListProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReccurrence, setSelectedReccurrence] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Remove the useEffect that fetches reccurrences since it will be handled by the parent component
  // useEffect(() => {
  //   const getRecurrences = async () => {
  //     try {
  //       setLoading(true);
  //       const data = await fetchRecurrences();
  //       setReccurrences(data);
  //       setError(null);
  //     } catch (err) {
  //       console.error('Erreur lors de la récupération des récurrences:', err);
  //       setError('Erreur lors de la récupération des récurrences');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   getRecurrences();
  // }, []);

  const handleReccurrenceCreated = (newReccurrence: any) => {
    onReccurrenceCreated(newReccurrence);
  };

  const handleDeleteReccurrence = async (reccurrenceId: string) => {
    try {
      await deleteRecurrence(reccurrenceId);
      onDeleteReccurrence(reccurrenceId);
    } catch (error) {
      console.error('Erreur lors de la suppression de la récurrence:', error);
    }
  };

  const handleEditReccurrence = (reccurrence: any) => {
    setSelectedReccurrence(reccurrence);
    setIsEditDialogOpen(true);
  };

  const handleReccurrenceUpdated = (updatedReccurrence: any) => {
    onEditReccurrence(updatedReccurrence);
  };

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
          Nouvelle Récurrence
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Récurrences</h1>
      </div>

      {/* Afficher un message d'erreur si une erreur survient */}
      {error && (
        <div className="text-red-500 text-center my-4">
          {error}
        </div>
      )}

      {/* Afficher un indicateur de chargement pendant que les données sont récupérées */}
      {loading ? (
        <div className="text-center my-4">Chargement en cours...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Fréquence</TableHead>
              <TableHead>Date de début</TableHead>
              <TableHead>Date de fin</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reccurrences && reccurrences.length > 0 ? (
              reccurrences.map((reccurrence) => (
                <TableRow key={reccurrence.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'rounded-full p-2',
                          reccurrence.type === 'income'
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-red-500/10 text-red-500'
                        )}
                      >
                        {reccurrence.type === 'income' ? (
                          <ArrowDownCircle className="h-4 w-4" />
                        ) : (
                          <ArrowUpCircle className="h-4 w-4" />
                        )}
                      </div>
                      {reccurrence.name}
                    </div>
                  </TableCell>
                  <TableCell>{reccurrence.frequency}</TableCell>
                  <TableCell>
                    {new Date(reccurrence.startDate).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    {new Date(reccurrence.endDate).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell
                    className={cn(
                      'font-medium',
                      reccurrence.type === 'income' ? 'text-green-500' : 'text-red-500'
                    )}
                  >
                    {reccurrence.amount.toLocaleString('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </TableCell>
                  <TableCell>{reccurrence.type}</TableCell>
                  <TableCell>
                    {categories.find((cat) => cat.id === reccurrence.categoryId)?.name || 'Non catégorisé'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditReccurrence(reccurrence)}>
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteReccurrence(reccurrence.id)}
                        >
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Aucune récurrence trouvée.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      <ReccurrenceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onReccurrenceCreated={handleReccurrenceCreated}
      />

      {selectedReccurrence && (
        <EditReccurrenceDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          reccurrence={selectedReccurrence}
          onReccurrenceUpdated={handleReccurrenceUpdated}
        />
      )}
    </div>
  );
}