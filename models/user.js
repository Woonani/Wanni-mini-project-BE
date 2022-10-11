const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      logId: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: false,
      },
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: false,
      },
      className: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: false,
      },
      phoneNum: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        unique: true,
      },
      // age: {
      //   type: Sequelize.INTEGER.UNSIGNED,
      //   allowNull: false,
      // },
      // married: {
      //   type: Sequelize.BOOLEAN,
      //   allowNull: false,
      // },
      // comment: {
      //   type: Sequelize.TEXT,
      //   allowNull: true,
      // },
      // created_at: {
      //   type: Sequelize.DATE,
      //   allowNull: false,
      //   defaultValue: Sequelize.NOW,
      // },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Student, { foreignKey: 'teachId', sourceKey: 'id' });
  }
};
