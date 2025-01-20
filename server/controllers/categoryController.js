  const { Category, Budget } = require('../models');

  module.exports = {
    categoryController: {
      // Créer une catégorie
      createCategory: async (req, res) => {
        try {
          const { name } = req.body;

          // Récupérer l'ID utilisateur connecté depuis le middleware
          const userId = req.user.id;

          // Vérifier que le nom est fourni
          if (!name) {
            return res.status(400).json({ message: 'Le nom de la catégorie est requis.' });
          }

          // Récupérer le budget unique
          const budget = await Budget.findOne();
          if (!budget) {
            return res.status(500).json({ message: 'Aucun budget trouvé. Veuillez en créer un.' });
          }

          // Créer la catégorie associée au budget
          const newCategory = await Category.create({
            name,
            budgetId: budget.id, // Associer la catégorie au budget unique
            userId
          });

          res.status(201).json(newCategory);
        } catch (error) {
          console.error('Erreur lors de la création de la catégorie:', error);
          res.status(500).json({ message: 'Erreur serveur.' });
        }
      },

      // Récupérer toutes les catégories
      getAllCategories: async (req, res) => {
        try {
          // Récupérer toutes les catégories
          const categories = await Category.findAll();
          res.status(200).json(categories);
        } catch (error) {
          console.error('Erreur lors de la récupération des catégories:', error);
          res.status(500).json({ message: 'Erreur serveur.' });
        }
      },

      // Mettre à jour une catégorie
      updateCategory: async (req, res) => {
        try {
          const { id } = req.params;
          const { name } = req.body;

          // Vérifier que le nom est fourni
          if (!name) {
            return res.status(400).json({ message: 'Le nom de la catégorie est requis.' });
          }

          // Rechercher la catégorie par son ID
          const category = await Category.findByPk(id);
          if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée.' });
          }

          // Mettre à jour la catégorie
          await category.update({ name });

          res.status(200).json(category);
        } catch (error) {
          console.error('Erreur lors de la mise à jour de la catégorie:', error);
          res.status(500).json({ message: 'Erreur serveur.' });
        }
      },

      // Supprimer une catégorie
      deleteCategory: async (req, res) => {
        try {
          const { id } = req.params;

          // Rechercher la catégorie par son ID
          const category = await Category.findByPk(id);
          if (!category) {
            return res.status(404).json({ message: 'Catégorie non trouvée.' });
          }

          // Supprimer la catégorie
          await category.destroy();

          res.status(200).json({ message: 'Catégorie supprimée avec succès.' });
        } catch (error) {
          console.error('Erreur lors de la suppression de la catégorie:', error);
          res.status(500).json({ message: 'Erreur serveur.' });
        }
      },
    },
  };
