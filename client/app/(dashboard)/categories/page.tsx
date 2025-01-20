'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { CategoryDialog } from '@/components/categories/category-dialog';

const categories = [
  {
    id: 1,
    nom: 'Alimentation',
    type: 'expense',
    couleur: '#EF4444',
  },
  {
    id: 2,
    nom: 'Transport',
    type: 'expense',
    couleur: '#3B82F6',
  },
  {
    id: 3,
    nom: 'Loisirs',
    type: 'expense',
    couleur: '#10B981',
  },
  {
    id: 4,
    nom: 'Salaire',
    type: 'income',
    couleur: '#6366F1',
  },
];

export default function CategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Catégories</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle catégorie
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.couleur }}
                />
                <div>
                  <h3 className="font-medium">{category.nom}</h3>
                  <p className="text-sm text-muted-foreground">
                    {category.type === 'income' ? 'Revenu' : 'Dépense'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <CategoryDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}