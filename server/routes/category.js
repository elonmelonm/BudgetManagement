const express = require('express');
const router = express.Router();
const { categoryController } = require('../controllers/categoryController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Créer une catégorie (POST)
router.post('/', authMiddleware.isAuthenticated, categoryController.createCategory);

// Récupérer toutes les catégories (GET)
router.get('/', authMiddleware.isAuthenticated, categoryController.getAllCategories);

// Mettre à jour une catégorie (PUT)
router.put('/:id', authMiddleware.isAuthenticated, categoryController.updateCategory);

// Supprimer une catégorie (DELETE)
router.delete('/:id', authMiddleware.isAuthenticated, categoryController.deleteCategory);

module.exports = router;
