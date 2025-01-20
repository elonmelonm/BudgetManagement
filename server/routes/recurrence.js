const express = require('express');
const router = express.Router();
const { recurrenceController } = require('../controllers/recurrenceController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Créer une récurrence (POST)
router.post('/', authMiddleware.isAuthenticated, recurrenceController.createRecurrence);

// Récupérer les récurrences d'un seul budget (GET)
router.get('/', authMiddleware.isAuthenticated, recurrenceController.getRecurrences);

// Récupérer toutes les récurrences (GET)
router.get('/all', authMiddleware.isAuthenticated, recurrenceController.getAllRecurrences);

// Récupérer une récurrence par ID (GET)
router.get('/:id', authMiddleware.isAuthenticated, recurrenceController.getRecurrenceById);

// Mettre à jour une récurrence (PUT)
router.put('/:id', authMiddleware.isAuthenticated, recurrenceController.updateRecurrence);

// Supprimer une récurrence (DELETE)
router.delete('/:id', authMiddleware.isAuthenticated, recurrenceController.deleteRecurrence);

// Créer un budget principal si aucun n'existe déjà (POST)
router.post('/budget', recurrenceController.createBudget);

// Mettre à jour le budget principal (PUT)
router.put('/budget', recurrenceController.updateBudget);

module.exports = router;
