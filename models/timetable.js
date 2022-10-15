const Sequelize = require('sequelize');

module.exports = class Timetable extends Sequelize.Model {
  static init(sequelize) {
    return super.init({      
      day: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: false,
      },
      lesson: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: false,
      },
      stuName: {
        type: Sequelize.STRING(30),
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
      modelName: 'Timetable',
      tableName: 'timetables',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    // db.Timetable.belongsToMany(db.User, { foreignKey: 'teachId', targetKey: 'id' });
    // db.Timetable.belongsToMany(db.Student, { foreignKey: 'studentId', targetKey: 'id' });
    db.Timetable.belongsTo(db.User, { foreignKey: 'teachId', targetKey: 'id' });
    db.Timetable.belongsTo(db.Student, { foreignKey: 'studentId', targetKey: 'id' });
  
}
};
