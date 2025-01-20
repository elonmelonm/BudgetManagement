const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Recurrence extends Model {
    static associate(models) {
      Recurrence.belongsTo(models.Category, { foreignKey: 'categoryId', as: 'category' });
      Recurrence.belongsTo(models.Budget, { foreignKey: 'budgetId', as: 'budget' });
      Recurrence.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  Recurrence.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      frequency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      budgetId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Recurrence',
    }
  );

  return Recurrence;
};
