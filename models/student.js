const Sequelize = require('sequelize');

// 1. 테이블 모델 설정
module.exports = class Student extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      stuName: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: false,
      },
      stuGrade: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        unique: false,
      },      
      school : {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: false,
      },
      phoneNum: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        unique: false,
      },
      etc: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: false,
      modelName: 'Student',
      tableName: 'students',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
// 2. 테이블 간 관계설정 (사용법)
  static associate(db) {
    db.Student.belongsTo(db.User, { foreignKey: 'teachId', targetKey: 'id' });
    db.Student.hasMany(db.Timetable, { foreignKey: 'studentId', sourceKey: 'id' });
    db.Student.hasMany(db.Schedule, { foreignKey: 'studentId', sourceKey: 'id' });
  }
};

