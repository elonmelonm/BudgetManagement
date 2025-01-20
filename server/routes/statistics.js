const express = require('express');
const statisticsController = require('../controllers/statisticsController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Récupérer un résumé du budget (dépenses, revenus, solde actuel)
router.get('/budget-summary', authMiddleware.isAuthenticated, statisticsController.getBudgetSummary);

// Récupérer la progression des objectifs financiers
router.get('/goals-progress', authMiddleware.isAuthenticated, statisticsController.getGoalsProgress);

// Récupérer des statistiques de dépenses par catégorie
router.get('/category-expenses', authMiddleware.isAuthenticated, statisticsController.getCategoryExpenses);

// Récupérer un résumé des récurrences (dépenses et revenus récurrents)
router.get('/recurrence-summary', authMiddleware.isAuthenticated, statisticsController.getRecurrenceSummary);

module.exports = router;
