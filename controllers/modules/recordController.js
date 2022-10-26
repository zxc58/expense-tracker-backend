/* eslint-disable no-unused-vars */
const { validationResult } = require('express-validator')
// const { Record, User } = require('../../models')
const {
  recordService: { getOnesAllRecord, updateRecord, createRecord, deleteRecord }
} = require('../../services')
const recordController = {
  getRecord: async (req, res, next) => {
    try {
      const userId = req.user.id
      const records = await getOnesAllRecord(userId)
      const message =
        'get all record success,data->all record of user id ' + userId
      return res.json({ status: true, message, records })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  postRecord: async (req, res, next) => {
    try {
      if (!validationResult(req).isEmpty()) {
        return res.status(500).json({
          status: false,
          message: 'validation fails',
          errors: JSON.stringify(validationResult(req).array())
        })
      }
      const { name, date } = req.body
      const [amount, categoryId] = [
        Number(req.body.amount),
        Number(req.body.categoryId)
      ]
      const userId = req.user.id
      const postData = await createRecord({
        name,
        date,
        amount,
        categoryId,
        userId
      })
      return res.json({
        status: true,
        message: 'post record success,data->post record',
        postData
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  putRecord: async (req, res, next) => {
    try {
      if (!validationResult(req).isEmpty()) {
        return res.status(500).json({
          status: false,
          message: 'validation fail',
          errors: JSON.stringify(validationResult(req).array())
        })
      }
      const { name, date } = req.body
      const [amount, categoryId] = [
        Number(req.body.amount),
        Number(req.body.categoryId)
      ]
      const id = Number(req.params.id)
      const userId = req.user.id
      const updateData = await updateRecord(id, userId, {
        name,
        date,
        amount,
        categoryId
      })
      const message = 'Update record success,updateData->record after update'
      return res.json({ status: true, message, updateData })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  deleteRecord: async (req, res, next) => {
    try {
      const id = Number(req.params.id)
      const userId = req.user.id
      const deleteData = await deleteRecord(id, userId)
      const message = 'delete record success,data->the delete record'
      return res.json({ status: true, message, deleteData })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  }
}
module.exports = recordController
