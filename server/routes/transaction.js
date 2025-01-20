const express = require('express');
const router = express.Router();
const { transactionController } = require('../controllers/transactionController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Créer une transaction (POST)
router.post('/', authMiddleware.isAuthenticated, transactionController.createTransaction);

// Récupérer toutes les transactions (GET)
router.get('/', authMiddleware.isAuthenticated, transactionController.getAllTransactions);

// Récupérer une transaction par ID (GET)
router.get('/:id', authMiddleware.isAuthenticated, transactionController.getTransactionById);

// Mettre à jour une transaction (PUT)
router.put('/:id', authMiddleware.isAuthenticated, transactionController.updateTransaction);

// Supprimer une transaction (DELETE)
router.delete('/:id', authMiddleware.isAuthenticated, transactionController.deleteTransaction);

module.exports = router;
