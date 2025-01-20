const { Recurrence, Budget } = require('../models');

module.exports = {
  recurrenceController: {
    // Créer une récurrence
    createRecurrence: async (req, res) => {
      try {
        const { name, frequency, startDate, endDate, amount, type } = req.body;
        const userId = req.user.id
        
        // Récupère le seul budget existant
        const budget = await Budget.findOne(); // Assurez-vous qu'il existe au moins un budget

        if (!budget) {
          return res.status(404).json({ message: 'Aucun budget trouvé.' });
        }

        // Créer la récurrence avec le budget trouvé
        const newRecurrence = await Recurrence.create({
          name,
          frequency,
          startDate,
          endDate,
          amount,
          budgetId: budget.id, // Utilise l'ID du seul budget
          type,
          userId,
        });

        res.status(201).json(newRecurrence);
      } catch (error) {
        console.error('Erreur lors de la création de la récurrence:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Récupérer les récurrences d'un seul budget
    getRecurrences: async (req, res) => {
      try {
        // Récupère le seul budget existant
        const budget = await Budget.findOne();

        if (!budget) {
          return res.status(404).json({ message: 'Aucun budget trouvé.' });
        }

        // Récupérer toutes les récurrences associées à ce budget
        const recurrences = await Recurrence.findAll({ where: { budgetId: budget.id } });

        res.status(200).json(recurrences);
      } catch (error) {
        console.error('Erreur lors de la récupération des récurrences:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Récupérer toutes les récurrences
    getAllRecurrences: async (req, res) => {
      try {
        const recurrences = await Recurrence.findAll();
        res.status(200).json(recurrences);
      } catch (error) {
        console.error('Erreur lors de la récupération de toutes les récurrences:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Récupérer une récurrence par son ID
    getRecurrenceById: async (req, res) => {
      try {
        const { id } = req.params;

        const recurrence = await Recurrence.findByPk(id);

        if (!recurrence) {
          return res.status(404).json({ message: 'Récurrence non trouvée.' });
        }

        res.status(200).json(recurrence);
      } catch (error) {
        console.error('Erreur lors de la récupération de la récurrence:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Mettre à jour une récurrence
    updateRecurrence: async (req, res) => {
      try {
        const { id } = req.params;
        const { name, frequency, startDate, endDate, amount, type } = req.body;

        const recurrence = await Recurrence.findByPk(id);

        if (!recurrence) {
          return res.status(404).json({ message: 'Récurrence non trouvée.' });
        }

        await recurrence.update({ name, frequency, startDate, endDate, amount, type });

        res.status(200).json(recurrence);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la récurrence:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Supprimer une récurrence
    deleteRecurrence: async (req, res) => {
      try {
        const { id } = req.params;

        const recurrence = await Recurrence.findByPk(id);

        if (!recurrence) {
          return res.status(404).json({ message: 'Récurrence non trouvée.' });
        }

        await recurrence.destroy();

        res.status(200).json({ message: 'Récurrence supprimée avec succès.' });
      } catch (error) {
        console.error('Erreur lors de la suppression de la récurrence:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Créer un budget principal si aucun n'existe déjà
    createBudget: async (req, res) => {
      try {
        // Vérifier s'il existe déjà un budget
        const existingBudget = await Budget.findOne();

        if (existingBudget) {
          return res.status(400).json({ message: 'Un budget principal existe déjà.' });
        }

        // Récupérer les données du budget
        const { name, amount } = req.body;

        // Créer un nouveau budget
        const newBudget = await Budget.create({
          name,
          amount,
        });

        res.status(201).json(newBudget);
      } catch (error) {
        console.error('Erreur lors de la création du budget:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Mettre à jour le budget principal
    updateBudget: async (req, res) => {
      try {
        // Vérifier s'il existe un budget
        const budget = await Budget.findOne();

        if (!budget) {
          return res.status(404).json({ message: 'Aucun budget trouvé.' });
        }

        const { name, amount } = req.body;

        // Mettre à jour le budget
        await budget.update({
          name,
          amount,
        });

        res.status(200).json(budget);
      } catch (error) {
        console.error('Erreur lors de la mise à jour du budget:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },
  },
};
