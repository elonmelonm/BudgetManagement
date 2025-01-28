require('dotenv').config();
const cors = require('cors');
const express = require('express');
const sequelize = require('./config/db');
const { isAuthenticated, isAdmin } = require('./middlewares/authMiddleware');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const budgetRoutes = require('./routes/budget');
const transactionRoutes = require('./routes/transaction');
const categoryRoutes = require('./routes/category');
const recurrenceRoutes = require('./routes/recurrence');
const goalRoutes = require('./routes/goal');
const statisticsRoutes = require('./routes/statistics');

const app = express();
const PORT = process.env.PORT || 5000;

// Liste des origines autorisées
const allowedOrigins = ['https://budget-management-liard.vercel.app'];


// Configuration CORS avec une fonction pour gérer plusieurs origines
app.use(
cors({
    origin: (origin, callback) => {
    // Autorise l'origine si elle est dans la liste ou si elle est absente (par exemple, pour des outils comme Postman)
    if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
    },
})
);

// Middleware pour parser le JSON
app.use(express.json());

// Routes
try {
    // Les routes pour l'authentification
    app.use('/api/auth', authRoutes);
    // Routes des utilisateurs
    app.use('/api/users', usersRoutes);

    
    app.use('/api/budgets', budgetRoutes);
    app.use('/api/transactions', transactionRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/recurrences', recurrenceRoutes);
    app.use('/api/goals', goalRoutes);
    app.use('/api/statistics', statisticsRoutes);
        

    console.log('Routes chargées avec succès.');
} catch (error) {
    console.error('Erreur lors du chargement des routes :', error.message);
}

// Test de la base de données
sequelize.authenticate()
    .then(() => {
        console.log('Connexion à la base de données réussie.');
        return sequelize.sync();
    })
    .then(() => {
        console.log('Synchronisation des modèles réussie.');
        // Démarrage du serveur
        app.listen(PORT, () => console.log(`Serveur actif sur le port ${PORT}`));
    })
    .catch((error) => {
        console.error('Erreur lors de la connexion à la base de données :', error.message);
    });

// Middleware pour gérer les erreurs globales
app.use((err, req, res, next) => {
    console.error('Erreur non gérée :', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});
