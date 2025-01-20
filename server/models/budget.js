const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Budget extends Model {
    static associate(models) {
      Budget.hasMany(models.Category, { foreignKey: 'budgetId', as: 'categories' });
      Budget.hasMany(models.Transaction, { foreignKey: 'budgetId', as: 'transactions' });
      Budget.hasMany(models.Recurrence, { foreignKey: 'budgetId', as: 'recurrences' });
      Budget.hasMany(models.Goal, { foreignKey: 'budgetId', as: 'goals' });
      // Association avec l'utilisateur
      Budget.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
  }

  Budget.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      initialAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      currentAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      userId: { // Nouvelle colonne pour l'association avec l'utilisateur
        type: DataTypes.UUID,
        references: {
          model: 'Users', // Assurez-vous que votre modèle User existe
          key: 'id',
        },
        allowNull: false, // ou laissez le nullable en fonction de votre logique
      },
    },
    {
      sequelize,
      modelName: 'Budget',
    }
  );

  return Budget;
};
