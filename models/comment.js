const Sequelize = require('sequelize');
 
// 1. 테이블 모델 설정
module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      message: {
        type: Sequelize.STRING(1000),
        allowNull: true,
        unique: false,
      },
      date: {
        type: Sequelize.STRING(20),
        allowNull: false,   //NotNull
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
      modelName: 'Comment',
      tableName: 'comments',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }
// 2. 테이블 간 관계설정 (사용법)
  static associate(db) {
    db.Comment.belongsTo(db.User, { foreignKey: 'teachId', targetKey: 'id' });
  }
};

