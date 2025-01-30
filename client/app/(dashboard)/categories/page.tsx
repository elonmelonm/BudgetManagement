'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/services/api';
import { EditCategoryDialog } from '@/components/categories/editCategoryDialog';
import { CategoryDialog } from '@/components/categories/category-dialog';

// Définir le type pour une catégorie
type Category = {
  id: string;
  name: string;
  isPredefined: boolean; // ✅ Ajout pour identifier les catégories prédéfinies
};

export default function CategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Récupérer les catégories lors du chargement de la page
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
      }
    };

    loadCategories();
  }, []);

  // Ajouter une nouvelle catégorie
  const handleCategoryCreated = (newCategory: Category) => {
    setCategories((prevCategories) => [...prevCategories, newCategory]);
  };

  // Modifier une catégorie
  const handleCategoryUpdated = (updatedCategory: Category) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.id === updatedCategory.id ? updatedCategory : cat
      )
    );
  };

  // Supprimer une catégorie
  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      setCategories((prevCategories) => prevCategories.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
    }
  };

  // Ouvrir le dialogue de modification
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        {/* Titre affiché uniquement en mode tablette et PC */}
        <h1 className="text-2xl font-semibold">Catégories</h1>
        
        {/* Bouton avec l'icône Plus */}
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center rounded-full">
          <Plus className="h-4 w-4" />
          {/* Texte affiché uniquement en mode tablette et PC */}
          <span className="hidden md:inline">Nouvelle catégorie</span>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id} className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{category.name}</h3>

              {/* Afficher les boutons Modifier/Supprimer uniquement pour les catégories personnalisées */}
              {!category.isPredefined && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <CategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCategoryCreated={handleCategoryCreated}
      />

      {selectedCategory && (
        <EditCategoryDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          category={selectedCategory}
          onCategoryUpdated={handleCategoryUpdated}
        />
      )}
    </div>
  );
}
