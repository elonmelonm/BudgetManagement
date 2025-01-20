'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Goals', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      targetAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      currentAmount: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      deadline: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      budgetId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Budgets',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users', // Vérifiez que votre modèle User est bien défini
          key: 'id',
        },
        allowNull: false, // ou true en fonction de votre logique
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Goals');
  },
};
