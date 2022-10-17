const Sequelize = require('sequelize');

module.exports = class Schedule extends Sequelize.Model {
  static init(sequelize) {
    return super.init({   
      lessonDate: {
        type: Sequelize.STRING,
        //DATE, 시/분/초를 안 받아 오더라도 검색 가능하게 하기 위해 STRING으로 변경 
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
        allowNull: true,
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
