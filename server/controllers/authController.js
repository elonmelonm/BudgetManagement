const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Import du modèle User
const { Op } = require('sequelize');
const nodemailer = require('nodemailer'); // Import de Nodemailer
const crypto = require('crypto');


const SECRET_KEY = process.env.SECRET_KEY; // Assurez-vous de définir un secret pour JWT.

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Par exemple, avec Gmail
  port: 465, 
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // L'adresse email de l'expéditeur
    pass: process.env.EMAIL_PASS, // Le mot de passe de l'email
  },
});

const verifyToken = async (req) => {
  const token = req.headers.authorization?.split(' ')[1]; // Récupération du token depuis les en-têtes

  if (!token) {
    return res.status(401).json({ message: 'Token manquant.' });
  }

  try {
    // Vérification du token
    const decoded = jwt.verify(token, SECRET_KEY); 
    
    // Utilisation de l'ID directement depuis le token décodé
    const userId = decoded.id;

    // Chercher l'utilisateur dans la base de données
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('Utilisateur non trouvé.');
    }

    // Retourner l'utilisateur trouvé
    return user;
  } catch (error) {
    throw new Error(error.message || 'Token invalide ou expiré.');
  }
}

module.exports = {
  // Inscription
  signup: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
      }
      

      // Vérification si l'utilisateur existe déjà
      const existingUser = await User.findOne({
        where: { [Op.or]: [{ email }, { username }] },
      });
      if (existingUser) {
        return res.status(400).json({ message: 'Email ou username déjà utilisé.' });
      }

      // Hashage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Création de l'utilisateur
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        verificationStatus: false, // Par défaut, l'utilisateur n'est pas vérifié
      });

      // Génération d'un token d'activation
      const activationToken = jwt.sign(
        { id: newUser.id, email: newUser.email },
        SECRET_KEY,
        { expiresIn: '24h' } // Le lien d'activation est valide pendant 24 heures
      );

      // Création du lien d'activation
      const activationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/activate-account/${activationToken}`;

      // Envoi d'un email de confirmation
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Activation de votre compte',
        html: `
          <body>
            <p>Bonjour ${username},</p>
            <p>Merci de vous être inscrit. Votre compte a été créé avec succès !</p>
            <p>Veuillez activer votre compte en cliquant sur le lien suivant :</p>
            <a href="${activationLink}">${activationLink}</a>
            <p>Ce lien est valide pendant 24 heures.</p>
            <p>Cordialement,</p>
            <p>L'équipe.</p>
          </body>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('Envoi d\'email à: ' +  email + ' réussi.')

      } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        return res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email de vérification.' });
      }
      

      res.status(201).json({
        message: 'Utilisateur créé avec succès. Un email de vérification a été envoyé.',
        user: { id: newUser.id, username: newUser.username, email: newUser.email },
      });
      console.log('Utilisateur: ' +  email + ' créé avec succes.')
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // Connexion
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Recherche de l'utilisateur
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }

      // Vérification si le compte est activé
      if (!user.verificationStatus) { // Assurez-vous que "verificationStatus" existe dans votre modèle User
          return res.status(403).json({ message: 'Votre compte n\'est pas activé. Veuillez vérifier votre email.' });
      }

      // Vérification si le compte est supprimé
      if (user.is_deleted) { 
        return res.status(403).json({ message: 'Votre compte est supprimé.' });
      }

      // Vérification du mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Mot de passe incorrect.' });
      }

      // Génération du token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        SECRET_KEY,
        { expiresIn: '1h' } // Durée de validité du token
      );

      res.status(200).json({
        message: 'Connexion réussie.',
        token,
        user: { id: user.id, username: user.username, email: user.email },
      });
      console.log('Connexion de: ' + user.email + ' réussie')
    } catch (error) {
      console.error('Erreur lors de la connexion', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // Route d'activation de compte
    activateAccount: async (req, res) => {
        const { token } = req.params;
    
        try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = await User.findByPk(decoded.id);
        const email = await User.findByPk(decoded.email);
    
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé.' });
        }
    
        if (user.verificationStatus) {
            return res.status(400).json({ message: 'Compte déjà activé.' });
        }
    
        user.verificationStatus = true;
        await user.save();
    
        res.status(200).json({ message: 'Compte activé avec succès.' });
        console.log('compte de l\'utilisateur ' + email + ' activé avec succès.')
        } catch (error) {
        console.error('Erreur lors de l\'activation du compte:', error);
        res.status(400).json({ message: 'Lien d\'activation invalide ou expiré.' });
        }
    },
  

  // Vérification du token
  

  // Demande de réinitialisation de mot de passe (envoi de l'email avec le lien de réinitialisation)
  requestPasswordReset: async (req, res) => {
    const { email } = req.body;

    try {
      // Recherche de l'utilisateur par email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé.' });
      }

      // Génération d'un token de réinitialisation
      const resetToken = crypto.randomBytes(20).toString('hex'); // Générer un token aléatoire
      const resetTokenExpiration = Date.now() + 3600000; // Le token expire après 1 heure

      // Mise à jour de l'utilisateur avec le token et son expiration
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetTokenExpiration;
      await user.save();

      // Création du lien de réinitialisation
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

      // Envoi de l'email avec le lien de réinitialisation
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Réinitialisation de votre mot de passe',
        html: `
          <body>
            <p>Bonjour ${user.username},</p>
            <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
            <p>Veuillez cliquer sur le lien suivant pour réinitialiser votre mot de passe :</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>Ce lien est valide pendant 1 heure.</p>
            <p>Cordialement,</p>
            <p>L'équipe.</p>
          </body>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('Envoi d\'email de réinitialisation à: ' + email + ' réussi.');
        res.status(200).json({ message: 'Un email de réinitialisation a été envoyé.' });
      } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email de réinitialisation.' });
      }
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation de mot de passe:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // Réinitialisation du mot de passe
  resetPassword: async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
      // Recherche de l'utilisateur par token de réinitialisation
      const user = await User.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: { [Op.gt]: Date.now() }, // Vérifier si le token est encore valide
        },
      });

      if (!user) {
        return res.status(400).json({ message: 'Token invalide ou expiré.' });
      }

      // Hashage du nouveau mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Mise à jour du mot de passe
      user.password = hashedPassword;
      user.resetPasswordToken = null; // Réinitialisation du token
      user.resetPasswordExpires = null; // Réinitialisation de l'expiration
      await user.save();

      res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },

  // Changement de mot de passe
changePassword: async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Vérification des données
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Les deux mots de passe sont requis.' });
  }

  try {
    // Vérifier et obtenir l'utilisateur depuis le token
    const user = await verifyToken(req); // Appel de la fonction de vérification du token

    // Vérifier si le mot de passe actuel est correct
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe actuel incorrect.' });
    }

    // Hashage du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mise à jour du mot de passe de l'utilisateur
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
}

};


