require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { swaggerUi, swaggerDocs } = require('./swagger');
const sequelize = require('./config/db');
const { isAuthenticated, isAdmin } = require('./middlewares/authMiddleware');
const authRoutes = require('./routes/auth');
const thematicRoutes = require('./routes/thematic');
const serieRoutes = require('./routes/series');
const videoRoutes = require('./routes/video');
const commentRoutes = require('./routes/comment');
const videoLikeRoutes = require('./routes/videoLike');
const videoViewRoutes = require('./routes/videoView');
const adminRoutes = require('./routes/admin');
const usersRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 5000;

// Liste des origines autorisées
const allowedOrigins = ['https://fairstories.vercel.app', 'http://localhost:3000'];


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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
try {
    // Les routes pour l'authentification
    app.use('/api/auth', authRoutes);
    // Les routes pour les thématiques
    app.use('/api/thematics', thematicRoutes);
    // Les routes pour les series
    app.use('/api/series', serieRoutes);
    // Les routes pour les videos
    app.use('/api/videos', videoRoutes);
    // Les routes pour les commentaires
    app.use('/api/comments', commentRoutes);
    // Les routes pour les likes et dislikes
    app.use('/api/video-likes', videoLikeRoutes);
    // Les routes pour les vues des videos
    app.use('/api/video-views', videoViewRoutes);

    // Routes des utilisateurs
    app.use('/api/users', usersRoutes);    
    // Routes des administrateurs
    app.use('/api/admins', adminRoutes);

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
        console.log(`Documentation Swagger sur https://fairstories.vercel.app/api-docs`);
        console.log(`Documentation Swagger sur http://localhost:${PORT}/api-docs`);
    })
    .catch((error) => {
        console.error('Erreur lors de la connexion à la base de données :', error.message);
    });

// Middleware pour gérer les erreurs globales
app.use((err, req, res, next) => {
    console.error('Erreur non gérée :', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});
