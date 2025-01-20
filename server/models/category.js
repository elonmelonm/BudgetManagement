const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsTo(models.Budget, { foreignKey: 'budgetId', as: 'budget' });
      Category.hasMany(models.Transaction, { foreignKey: 'categoryId', as: 'transactions' });
      Category.hasMany(models.Recurrence, { foreignKey: 'categoryId', as: 'recurrences' });
      Category.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  Category.init(
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
      budgetId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Category',
    }
  );

  return Category;
};
