const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs (Admin uniquement)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   username:
 *                     type: string
 *                     example: "johndoe"
 *                   email:
 *                     type: string
 *                     example: "john.doe@example.com"
 *       403:
 *         description: Accès refusé, l'utilisateur doit être un administrateur
 */
router.get('/', authMiddleware.isAdmin, userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID (utilisateur authentifié uniquement)
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 username:
 *                   type: string
 *                   example: "johndoe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *       403:
 *         description: L'utilisateur doit être authentifié pour accéder à ses informations
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', authMiddleware.isAuthenticated, userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur (utilisateur authentifié uniquement)
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johnnydoe"
 *               email:
 *                 type: string
 *                 example: "johnny.doe@example.com"
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès
 *       403:
 *         description: L'utilisateur doit être authentifié pour effectuer cette action
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/:id', authMiddleware.isAuthenticated, userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur (Admin uniquement)
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à supprimer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       403:
 *         description: Accès refusé, l'utilisateur doit être un administrateur
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/:id', authMiddleware.isAdmin, userController.deleteUser);

module.exports = router;
