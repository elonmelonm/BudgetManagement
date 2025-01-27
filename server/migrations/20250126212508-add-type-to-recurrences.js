'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Recurrences', 'type', {
      type: Sequelize.ENUM('income', 'expense'),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Recurrences', 'type');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Recurrences_type";'); // Supprimer le type ENUM
  },
};
