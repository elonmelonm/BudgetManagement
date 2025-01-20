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

        // Vérifier si les données de mise à jour sont fournies
        if (initialAmount == null && currentAmount == null) {
          return res.status(400).json({ message: 'Veuillez fournir des données à mettre à jour.' });
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

          return res.status(201).json({ message: 'Budget créé avec succès.', budget });
        }

        // Mettre à jour le budget existant
        if (initialAmount != null) {
          // Ajuster currentAmount en fonction de la modification de initialAmount
          budget.currentAmount += initialAmount - budget.initialAmount;
          budget.initialAmount = initialAmount;
        }

        if (currentAmount != null) {
          budget.currentAmount = currentAmount;
        }

        await budget.save(); // Sauvegarder les modifications
        res.status(200).json({ message: 'Budget mis à jour avec succès.', budget });
      } catch (error) {
        console.error('Erreur lors de la mise à jour du budget:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Supprimer un budget (non autorisé)
    deleteBudget: async (req, res) => {
      return res.status(405).json({ message: 'La suppression du budget n’est pas autorisée.' });
    },
  },
};
