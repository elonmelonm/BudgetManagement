const { Category, Budget } = require('../models');
const { Op } = require('sequelize');

module.exports = {
  categoryController: {
    // Créer une catégorie personnalisée
    createCategory: async (req, res) => {
      try {
        const { name } = req.body;
        const userId = req.user.id;

        // Vérifier que le nom est fourni
        if (!name) {
          return res.status(400).json({ message: 'Le nom de la catégorie est requis.' });
        }

        // Vérifier le nombre de catégories personnalisées de l'utilisateur
        const userCategoriesCount = await Category.count({ where: { userId, isPredefined: false } });

        if (userCategoriesCount >= 2) {
          return res.status(400).json({ message: 'Vous ne pouvez ajouter que deux catégories personnalisées.' });
        }

        // Récupérer le budget unique de l'utilisateur
        const budget = await Budget.findOne({ where: { userId } });
        if (!budget) {
          return res.status(404).json({ message: 'Aucun budget trouvé. Veuillez en créer un.' });
        }

        // Créer la nouvelle catégorie
        const newCategory = await Category.create({
          name,
          budgetId: budget.id,
          userId,
          isPredefined: false, // Catégorie utilisateur
        });

        res.status(201).json(newCategory);
      } catch (error) {
        console.error('Erreur lors de la création de la catégorie:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Récupérer toutes les catégories visibles par l'utilisateur (prédéfinies + personnalisées)
    getAllCategories: async (req, res) => {
      try {
        const userId = req.user.id;

        const categories = await Category.findAll({
          where: {
            [Op.or]: [
              { isPredefined: true }, // Catégories accessibles à tous
              { userId }, // Catégories créées par l'utilisateur
            ],
          },
        });

        res.status(200).json(categories);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Mettre à jour une catégorie utilisateur (les prédéfinies ne peuvent pas être modifiées)
    updateCategory: async (req, res) => {
      try {
        const { id } = req.params;
        const { name } = req.body;
        const userId = req.user.id;

        if (!name) {
          return res.status(400).json({ message: 'Le nom de la catégorie est requis.' });
        }

        // Rechercher la catégorie par son ID
        const category = await Category.findByPk(id);

        if (!category) {
          return res.status(404).json({ message: 'Catégorie non trouvée.' });
        }

        // Vérifier si c'est une catégorie prédéfinie
        if (category.isPredefined) {
          return res.status(403).json({ message: 'Vous ne pouvez pas modifier une catégorie prédéfinie.' });
        }

        // Vérifier que la catégorie appartient bien à l'utilisateur
        if (category.userId !== userId) {
          return res.status(403).json({ message: 'Accès interdit à cette catégorie.' });
        }

        await category.update({ name });

        res.status(200).json(category);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Supprimer une catégorie utilisateur (les prédéfinies ne peuvent pas être supprimées)
    deleteCategory: async (req, res) => {
      try {
        const { id } = req.params;
        const userId = req.user.id;

        // Rechercher la catégorie par son ID
        const category = await Category.findByPk(id);

        if (!category) {
          return res.status(404).json({ message: 'Catégorie non trouvée.' });
        }

        // Vérifier si c'est une catégorie prédéfinie
        if (category.isPredefined) {
          return res.status(403).json({ message: 'Vous ne pouvez pas supprimer une catégorie prédéfinie.' });
        }

        // Vérifier que la catégorie appartient bien à l'utilisateur
        if (category.userId !== userId) {
          return res.status(403).json({ message: 'Accès interdit à cette catégorie.' });
        }

        await category.destroy();

        res.status(200).json({ message: 'Catégorie supprimée avec succès.' });
      } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },
  },
};
