module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    verificationStatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    defaultScope: {
      where: { is_deleted: false }, // Exclure les utilisateurs supprimés par défaut
    },
    scopes: {
      all: { where: {} }, // Inclure tous les utilisateurs
    },
  });

  User.associate = (models) => {
    User.hasOne(models.Budget, { foreignKey: 'userId' });
    User.hasMany(models.Category, { foreignKey: 'userId' });
    User.hasMany(models.Transaction, { foreignKey: 'userId' });
    User.hasMany(models.Goal, { foreignKey: 'userId' });
    User.hasMany(models.Recurrence, { foreignKey: 'userId' });
  };

  return User;
};
