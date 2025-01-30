const { Transaction, Budget, Category } = require('../models');

module.exports = {
  transactionController: {
    // Créer une transaction
    createTransaction: async (req, res) => {
      try {
        const { name, amount, date, categoryId, type } = req.body;
        const userId = req.user.id;

        // Validation des données
        if (!name || !amount || !type || !date) {
          return res.status(400).json({ message: 'Tous les champs requis doivent être remplis.' });
        }

        if (!['income', 'expense'].includes(type)) {
          return res.status(400).json({ message: "Le type de transaction doit être 'income' ou 'expense'." });
        }

        // Vérifier que le budget existe
        const budget = await Budget.findOne({ where: { userId } });
        if (!budget) {
          return res.status(404).json({ message: 'Aucun budget trouvé. Veuillez en créer un.' });
        }

        // Calculer le nouveau montant
        const updatedAmount = type === 'income'
          ? budget.initialAmount + amount
          : budget.initialAmount - amount;

        if (updatedAmount < 0) {
          return res.status(400).json({ message: 'Le budget est insuffisant pour cette dépense.' });
        }

        // Mettre à jour le budget
        await budget.update({ initialAmount: updatedAmount });

        // Créer la transaction
        const newTransaction = await Transaction.create({
          name,
          amount,
          date,
          categoryId,
          budgetId: budget.id,
          type,
          userId,
        });

        // Récupérer la transaction créée avec la catégorie associée
        const transactionWithCategory = await Transaction.findByPk(newTransaction.id, {
          include: [{ model: Category, as: 'category', attributes: ['name'] }],
        });

        res.status(201).json(transactionWithCategory);
      } catch (error) {
        console.error('Erreur lors de la création de la transaction:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },


    // Mettre à jour une transaction
    updateTransaction: async (req, res) => {
      try {
        const { id } = req.params;
        const { name, amount, date, categoryId, type } = req.body;

        // Validation des données
        if (!name || !amount || !type || !date) {
          return res.status(400).json({ message: 'Tous les champs requis doivent être remplis.' });
        }

        if (!['income', 'expense'].includes(type)) {
          return res.status(400).json({ message: "Le type de transaction doit être 'income' ou 'expense'." });
        }

        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
          return res.status(404).json({ message: 'Transaction non trouvée.' });
        }

        const budget = await Budget.findByPk(transaction.budgetId);
        if (!budget) {
          return res.status(404).json({ message: 'Aucun budget trouvé.' });
        }

        // Annuler l'impact de l'ancienne transaction
        const revertedAmount = transaction.type === 'income'
          ? budget.initialAmount - transaction.amount
          : budget.initialAmount + transaction.amount;

        // Calculer le nouvel impact
        const updatedAmount = type === 'income'
          ? revertedAmount + amount
          : revertedAmount - amount;

        if (updatedAmount < 0) {
          return res.status(400).json({ message: 'Le budget est insuffisant pour cette modification.' });
        }

        // Mettre à jour le budget
        await budget.update({ initialAmount: updatedAmount });

        // Mettre à jour la transaction
        await transaction.update({ name, amount, date, categoryId, type });

        // Récupérer la transaction mise à jour avec la catégorie associée
        const updatedTransaction = await Transaction.findByPk(transaction.id, {
          include: [{ model: Category, as: 'category', attributes: ['name'] }],
        });

        res.status(200).json(updatedTransaction);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la transaction:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },


    // Supprimer une transaction
    deleteTransaction: async (req, res) => {
      try {
        const { id } = req.params;

        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
          return res.status(404).json({ message: 'Transaction non trouvée.' });
        }

        const budget = await Budget.findByPk(transaction.budgetId);
        if (!budget) {
          return res.status(404).json({ message: 'Aucun budget trouvé.' });
        }

        // Revenir sur l'impact de la transaction supprimée
        const updatedAmount = transaction.type === 'income'
          ? budget.initialAmount - transaction.amount
          : budget.initialAmount + transaction.amount;

        await budget.update({ initialAmount: updatedAmount });

        // Supprimer la transaction
        await transaction.destroy();

        res.status(200).json({ message: 'Transaction supprimée avec succès.' });
      } catch (error) {
        console.error('Erreur lors de la suppression de la transaction:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Récupérer toutes les transactions
    getAllTransactions: async (req, res) => {
        const userId = req.user.id;
        try {
        const transactions = await Transaction.findAll({ where: { userId },
          include: [{ model: Category, as: 'category', attributes: ['name'] }],
        });
        res.status(200).json(transactions);
      } catch (error) {
        console.error('Erreur lors de la récupération des transactions:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },

    // Récupérer une transaction par ID
    getTransactionById: async (req, res) => {
      try {
        const { id } = req.params;

        const transaction = await Transaction.findByPk(id, {
          include: [{ model: Category, as: 'category', attributes: ['name'] }],
        });

        if (!transaction) {
          return res.status(404).json({ message: 'Transaction non trouvée.' });
        }

        res.status(200).json(transaction);
      } catch (error) {
        console.error('Erreur lors de la récupération de la transaction:', error);
        res.status(500).json({ message: 'Erreur serveur.' });
      }
    },
  },
};

