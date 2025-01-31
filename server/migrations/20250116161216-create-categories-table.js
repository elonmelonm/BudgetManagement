'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Categories', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isPredefined: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      budgetId: {
        type: Sequelize.UUID,
        allowNull: true, // Permettre NULL pour les catégories prédéfinies
        references: {
          model: 'Budgets',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true, // Permettre NULL pour les catégories prédéfinies
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
    const { v4: uuidv4 } = require('uuid'); // Importer la librairie UUID

    await queryInterface.bulkInsert('Categories', [
      { id: uuidv4(), name: 'Alimentation', isPredefined: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Transport', isPredefined: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Logement', isPredefined: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Divertissement', isPredefined: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Santé', isPredefined: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Education', isPredefined: true, createdAt: new Date(), updatedAt: new Date() },
      { id: uuidv4(), name: 'Outils accessoires', isPredefined: true, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Categories');
  }
};
