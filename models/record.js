'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Record extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Record.belongsTo(models.User, { foreignKey: 'userId' })
      Record.belongsTo(models.Category, { foreignKey: 'categoryId' })
    }
  }
  Record.init({
    name: DataTypes.STRING,
    date: DataTypes.DATE,
    amount: DataTypes.NUMBER,
    userId: {
      type: DataTypes.NUMBER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    categoryId: {
      type: DataTypes.NUMBER,
      references: {
        model: 'Categories',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Record',
    underscored: true,
    tableName: 'Records'
  })
  return Record
}
