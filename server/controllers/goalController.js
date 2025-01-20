const { Goal, Budget } = require('../models');

module.exports = {
  goalController: {
    // Créer un objectif
    createGoal: async (req, res) => {
      try {
        const { name, targetAmount, deadline, budgetId } = req.body;
        const userId = req.user.id 

        // Validation des entrées
        if (!name || !targetAmount || !deadline) {
          return res.status(400).json({ message: 'Tous les champs requis doivent être remplis.' });
        }

        const budget = await Budget.findByPk(budgetId);

        if (!budget) {
          return res.status(404).json({ message: 'Budget non trouvé.' });
        }

        const newGoal = await Goal.create({ name, targetAmount, deadline, budgetId, userId });

        res.status(201).json(newGoal);
      } catch (error) {
        console.error('Erreur lors de la création de l\'objectif:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Récupérer les objectifs d'un budget
    getGoals: async (req, res) => {
      try {
        // const { budgetId } = req.query;

        // if (!budgetId) {
        //   return res.status(400).json({ message: 'L\'ID du budget est requis.' });
        // }

        const goals = await Goal.findAll();

        res.status(200).json(goals);
      } catch (error) {
        console.error('Erreur lors de la récupération des objectifs:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Récupérer un objectif par ID
    getGoalById: async (req, res) => {
      try {
        const { id } = req.params;

        const goal = await Goal.findByPk(id);

        if (!goal) {
          return res.status(404).json({ message: 'Objectif non trouvé.' });
        }

        res.status(200).json(goal);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'objectif:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Mettre à jour un objectif
    updateGoal: async (req, res) => {
      try {
        const { id } = req.params;
        const { name, targetAmount, deadline } = req.body;

        const goal = await Goal.findByPk(id);

        if (!goal) {
          return res.status(404).json({ message: 'Objectif non trouvé.' });
        }

        // Validation des entrées
        if (!name && !targetAmount && !deadline) {
          return res.status(400).json({ message: 'Aucune donnée à mettre à jour.' });
        }

        await goal.update({ name, targetAmount, deadline });

        res.status(200).json(goal);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'objectif:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Supprimer un objectif
    deleteGoal: async (req, res) => {
      try {
        const { id } = req.params;

        const goal = await Goal.findByPk(id);

        if (!goal) {
          return res.status(404).json({ message: 'Objectif non trouvé.' });
        }

        await goal.destroy();

        res.status(200).json({ message: 'Objectif supprimé avec succès.' });
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'objectif:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Contribuer à un objectif
    contributeToGoal: async (req, res) => {
      try {
        const { id } = req.params;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
          return res.status(400).json({ message: 'Un montant positif est requis pour la contribution.' });
        }

        const goal = await Goal.findByPk(id);

        if (!goal) {
          return res.status(404).json({ message: 'Objectif non trouvé.' });
        }

        if (goal.currentAmount + amount > goal.targetAmount) {
          return res.status(400).json({ message: 'Contribution dépasse l\'objectif.' });
        }

        const updatedAmount = goal.currentAmount + amount;

        await goal.update({ currentAmount: updatedAmount });

        // Vérifiez si l'objectif est atteint
        const message = updatedAmount === goal.targetAmount
          ? 'Objectif atteint !'
          : 'Contribution ajoutée avec succès.';

        res.status(200).json({ goal, message });
      } catch (error) {
        console.error('Erreur lors de la contribution à l\'objectif:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },
  },
};
