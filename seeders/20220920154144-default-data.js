'use strict'
const { userList, categoryList, recordList } = require('../Seed.json')
const bcrypt = require('bcryptjs')
module.exports = {
  async up (queryInterface, Sequelize) {
    userList.forEach(e => {
      // const salt = bcrypt.genSaltSync()
      const hash = bcrypt.hashSync(e.password)
      e.password = hash
      e.created_at = new Date(); e.updated_at = new Date()
    })
    categoryList.forEach(e => { e.created_at = new Date(); e.updated_at = new Date() })
    recordList.forEach(e => { e.created_at = new Date(); e.updated_at = new Date() })
    await Promise.all([
      queryInterface.bulkInsert('Users', userList),
      queryInterface.bulkInsert('Categories', categoryList),
      queryInterface.bulkInsert('Records', recordList)
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', {})
    await queryInterface.bulkDelete('Users', {})
    await queryInterface.bulkDelete('Records', {})
  }
}
