const express = require('express');
const { budgetController } = require('../controllers/budgetController');
const { authMiddleware } = require('../middlewares/authMiddleware'); // Importation du middleware d'authentification

const router = express.Router();

// CRUD pour les budgets avec authentification
router.get('/', authMiddleware.isAuthenticated, budgetController.getBudget); // Récupérer le budget de l'utilisateur connecté
router.put('/', authMiddleware.isAuthenticated, budgetController.updateBudget); // Mettre à jour le budget de l'utilisateur connecté
router.delete('/', authMiddleware.isAuthenticated, budgetController.deleteBudget); // Supprimer un budget (non autorisé)

module.exports = router;
