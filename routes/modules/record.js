const express = require('express')
const router = express.Router()
//
const { validator: { recordValidationGuard } } = require('../../middlewares')
const { recordController: { getRecord, putRecord, deleteRecord, postRecord } } = require('../../controllers')
//
router.get('/', getRecord)
router.post('/', recordValidationGuard, postRecord)
router.put('/:id', recordValidationGuard, putRecord)
router.delete('/:id', deleteRecord)
//
module.exports = router
