const { where } = require('sequelize');
const { Budget, Goal, Category, Transaction, Recurrence } = require('../models');

module.exports = {
  // Récupérer le résumé du budget
  getBudgetSummary: async (req, res) => {
    try {
        const userId = req.user.id;
        // Récupère le seul budget existant
      const budget = await Budget.findOne({where: { userId: userId }});
      console.log(budget)

      if (!budget) {
        return res.status(404).json({ message: 'Aucun budget trouvé.' });
      }

      // Calculer le total des dépenses et des revenus pour ce budget
      const expenses = await Transaction.findAll({
        where: { budgetId: budget.id, type: 'expense', userId: userId },
      });
      const incomes = await Transaction.findAll({
        where: { budgetId: budget.id, type: 'income', userId: userId },
      });

      console.log(expenses)
      console.log(incomes)

      const totalExpense = expenses.reduce((acc, exp) => acc + exp.amount, 0);
      const totalIncome = incomes.reduce((acc, inc) => acc + inc.amount, 0);
      const balance = totalIncome - totalExpense;

      const budgetSummary = {
        budgetId: budget.id,
        totalIncome,
        totalExpense,
        balance,
      };

      res.status(200).json(budgetSummary);
    } catch (error) {
      console.error('Erreur lors de la récupération du résumé du budget:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // Récupérer la progression des objectifs
  getGoalsProgress: async (req, res) => {
    try {
      // Récupérer tous les objectifs
      const goals = await Goal.findAll();

      // Calculer la progression pour chaque objectif
      const progress = goals.map(goal => {
        const progressPercent = (goal.currentAmount / goal.targetAmount) * 100;
        return { goalId: goal.id, progressPercent };
      });

      res.status(200).json(progress);
    } catch (error) {
      console.error('Erreur lors de la récupération de la progression des objectifs:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // Récupérer les dépenses par catégorie
  getCategoryExpenses: async (req, res) => {
    try {
      // Récupérer toutes les catégories et les transactions associées au budget principal
      const categories = await Category.findAll();
      const budget = await Budget.findOne();

      if (!budget) {
        return res.status(404).json({ message: 'Aucun budget trouvé.' });
      }

      const expenses = await Transaction.findAll({
        where: { budgetId: budget.id, type: 'expense' },
      });

      // Calculer le total des dépenses par catégorie
      const categoryExpenses = categories.map(category => {
        const totalCategoryExpense = expenses.filter(exp => exp.categoryId === category.id)
                                               .reduce((acc, trans) => acc + trans.amount, 0);
        return { category: category.name, totalExpense: totalCategoryExpense };
      });

      res.status(200).json(categoryExpenses);
    } catch (error) {
      console.error('Erreur lors de la récupération des dépenses par catégorie:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // Récupérer les récurrences
  getRecurrenceSummary: async (req, res) => {
    try {
      // Récupérer toutes les récurrences associées au budget principal
      const budget = await Budget.findOne();

      if (!budget) {
        return res.status(404).json({ message: 'Aucun budget trouvé.' });
      }

      const recurrences = await Recurrence.findAll({
        where: { budgetId: budget.id },
      });

      res.status(200).json(recurrences);
    } catch (error) {
      console.error('Erreur lors de la récupération des récurrences:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  }
};
