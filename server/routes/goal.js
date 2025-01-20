const express = require('express');
const router = express.Router();
const { goalController } = require('../controllers/goalController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Créer un objectif (POST)
router.post('/', authMiddleware.isAuthenticated, goalController.createGoal);

// Récupérer les objectifs d'un budget (GET)
router.get('/', authMiddleware.isAuthenticated, goalController.getGoals);

// Récupérer un objectif par ID (GET)
router.get('/:id', authMiddleware.isAuthenticated, goalController.getGoalById);

// Mettre à jour un objectif (PUT)
router.put('/:id', authMiddleware.isAuthenticated, goalController.updateGoal);

// Supprimer un objectif (DELETE)
router.delete('/:id', authMiddleware.isAuthenticated, goalController.deleteGoal);

// Contribuer à un objectif (POST)
router.post('/:id/contribute', authMiddleware.isAuthenticated, goalController.contributeToGoal);

module.exports = router;
