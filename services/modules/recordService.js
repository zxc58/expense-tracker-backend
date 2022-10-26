/* eslint-disable no-unused-vars */
const { User, Record, Category } = require('../../models')
const recordService = {
  createRecord: async (object) => {
    const { name, date, amount, categoryId, userId } = object
    const postRecord = await Record.create({
      name,
      date,
      amount,
      categoryId,
      userId
    })
    return postRecord.toJSON()
  },
  getOnesAllRecord: async (userId) => {
    const userWithRecords = await Record.findAll({
      where: { userId },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      raw: true,
      nest: true,
      order: [['date', 'DESC']]
    })
    return userWithRecords
  },
  getOneRecord: async (recordId) => {
    const record = await Record.findByPk(recordId, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
    return record.toJSON()
  },
  updateRecord: async (recordId, userId, newData) => {
    const record = await Record.findByPk(recordId, {
      attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
    if (!record) {
      throw new Error('Wrong parameter,record do not exist')
    }
    if (record.userId !== userId) {
      throw new Error('Not your record,no access to update')
    }
    const updateRecord = await record.update(newData)
    return updateRecord.toJSON()
  },
  deleteRecord: async (recordId, userId) => {
    const deleteRecord = await Record.findByPk(recordId)
    if (deleteRecord.userId !== userId) {
      throw new Error('Not your record,no access to delete')
    }
    await deleteRecord.destroy()
    return deleteRecord.toJSON()
  }
}
module.exports = recordService
