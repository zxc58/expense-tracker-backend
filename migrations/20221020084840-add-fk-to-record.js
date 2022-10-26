'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Records', 'category_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Categories',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    })
    await queryInterface.addColumn('Records', 'user_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Records', 'category_id')
    await queryInterface.removeColumn('Records', 'user_id')
  }
}
