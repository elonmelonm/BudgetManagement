const sequelize = require('./config/db'); // Importation de db.js

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion réussie à la base de données.');
  } catch (error) {
    console.error('❌ Échec de la connexion à la base de données :', error);
  }
}

testConnection();
