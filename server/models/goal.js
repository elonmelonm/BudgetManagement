const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Goal extends Model {
    static associate(models) {
      Goal.belongsTo(models.Budget, { foreignKey: 'budgetId', as: 'budget' });
      Goal.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  Goal.init(
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
      targetAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      currentAmount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      deadline: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      budgetId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Goal',
    }
  );

  return Goal;
};
