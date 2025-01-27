const { Budget } = require('../models');

module.exports = {
  budgetController: {
    // Récupérer le budget de l'utilisateur connecté
    getBudget: async (req, res) => {
      try {
        const userId = req.user.id; // ID de l'utilisateur connecté
        const budget = await Budget.findOne({ where: { userId } });

        if (!budget) {
          return res.status(404).json({ message: 'Aucun budget trouvé pour cet utilisateur.' });
        }

        res.status(200).json(budget);
      } catch (error) {
        console.error('Erreur lors de la récupération du budget:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Créer ou mettre à jour le budget de l'utilisateur connecté
    updateBudget: async (req, res) => {
      try {
        const { initialAmount, currentAmount } = req.body;
        const userId = req.user.id; // ID de l'utilisateur connecté
    
        // Validation des données
        if (initialAmount == null && currentAmount == null) {
          return res.status(400).json({ message: 'Veuillez fournir des données à mettre à jour (initialAmount ou currentAmount).' });
        }
    
        if (initialAmount != null && (typeof initialAmount !== 'number' || initialAmount < 0)) {
          return res.status(400).json({ message: 'initialAmount doit être un nombre positif.' });
        }
    
        if (currentAmount != null && (typeof currentAmount !== 'number' || currentAmount < 0)) {
          return res.status(400).json({ message: 'currentAmount doit être un nombre positif.' });
        }
    
        // Rechercher un budget existant pour cet utilisateur
        let budget = await Budget.findOne({ where: { userId } });
    
        if (!budget) {
          // Créer un nouveau budget si aucun n'existe
          budget = await Budget.create({
            initialAmount: initialAmount || 0,
            currentAmount: currentAmount || 0,
            userId,
          });
    
          return res.status(201).json({
            message: 'Budget créé avec succès.',
            budget: {
              id: budget.id,
              initialAmount: budget.initialAmount,
              currentAmount: budget.currentAmount,
              userId: budget.userId,
            },
          });
        }
    
        // Mettre à jour le budget existant
        if (initialAmount != null) {
          // Ajuster currentAmount en fonction de la modification de initialAmount
          const difference = initialAmount - budget.initialAmount;
          budget.currentAmount += difference;
          budget.initialAmount = initialAmount;
        }
    
        if (currentAmount != null) {
          budget.currentAmount = currentAmount;
        }
    
        await budget.save(); // Sauvegarder les modifications
    
        res.status(200).json({
          message: 'Budget mis à jour avec succès.',
          budget: {
            id: budget.id,
            initialAmount: budget.initialAmount,
            currentAmount: budget.currentAmount,
            userId: budget.userId,
          },
        });
      } catch (error) {
        console.error('Erreur lors de la mise à jour du budget:', error);
    
        // Gestion des erreurs spécifiques
        if (error.name === 'SequelizeUniqueConstraintError') {
          return res.status(400).json({ message: 'Violation de contrainte d\'unicité.' });
        }
    
        if (error.name === 'SequelizeValidationError') {
          return res.status(400).json({ message: 'Données de validation invalides.', details: error.errors });
        }
    
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du budget.', error: error.message });
      }
    },

    // Supprimer un budget (non autorisé)
    deleteBudget: async (req, res) => {
      return res.status(405).json({ message: 'La suppression du budget n’est pas autorisée.' });
    },
  },
};
