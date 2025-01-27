'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Budgets', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      initialAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      currentAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      uniqueConstraint: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
        allowNull: false,
        // unique: true, // Contrôle que cette valeur est unique
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'Users', // Vérifiez que votre modèle User est bien défini
          key: 'id',
        },
        allowNull: false, // ou true en fonction de votre logique
        unique: true,
        onDelete: 'CASCADE',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Budgets');
  }
};
