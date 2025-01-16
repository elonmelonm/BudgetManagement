const jwt = require('jsonwebtoken');
const { Admin } = require('../models'); // Modèle Sequelize pour la table Admins

// Middleware pour vérifier si l'utilisateur est authentifié
const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token is missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Vérifie le jeton JWT
        req.user = decoded; // Ajoute les données décodées du token à req.user
        next();
    } catch (error) {
        console.error('JWT verification failed:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Middleware pour vérifier si l'utilisateur est administrateur
const isAdmin = async (req, res, next) => {
    try {
        // Vérifie d'abord que l'utilisateur est authentifié
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: Token is missing' });
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY); // Vérifie le jeton JWT
            req.user = decoded; // Ajoute les données décodées du token à req.user
            next();
        } catch (error) {
            console.error('JWT verification failed:', error);
            res.status(401).json({ error: 'Invalid or expired token' });
        }
        
        // Vérifie si l'utilisateur est un administrateur
        const admin = await Admin.findOne({ where: { id: req.user.id } });

        if (!admin) {
            return res.status(403).json({ error: 'Forbidden: Admin access required' });
        }

        next(); // Accès autorisé
    } catch (error) {
        console.error('Error while checking admin privileges:', error);
        res.status(500).json({ error: 'Server error while checking admin privileges' });
    }
};

module.exports = {
    authMiddleware: {
        isAuthenticated,
        isAdmin,
    },
};
