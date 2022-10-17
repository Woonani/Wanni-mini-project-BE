const Sequelize = require('sequelize');

module.exports = class Schedule extends Sequelize.Model {
  static init(sequelize) {
    return super.init({   
      lessonDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
        },
      stuName: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: false,
      },
      attendTime: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Schedule',
      tableName: 'schedules',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    // db.Schedule.belongsToMany(db.User, { foreignKey: 'teachId', targetKey: 'id' });
    // db.Schedule.belongsToMany(db.Student, { foreignKey: 'studentId', targetKey: 'id' });
    db.Schedule.belongsTo(db.User, { foreignKey: 'teachId', targetKey: 'id' });
    db.Schedule.belongsTo(db.Student, { foreignKey: 'studentId', targetKey: 'id' });
  
} 
};
