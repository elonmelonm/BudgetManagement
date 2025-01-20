//db.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
   process.env.DB_NAME,
   process.env.DB_USER,
   process.env.DB_PASSWORD,
   {
       host: process.env.DB_HOST,
       dialect: process.env.DB_DIALECT,
       logging: false, // Désactiver les logs SQL pour une meilleure lisibilité
       port:process.env.DB_PORT || 3306,
   }
);

module.exports = sequelize;
