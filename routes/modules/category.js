const express = require('express')
const router = express.Router()
//
const {
  categoryController: { getCategories }
} = require('../../controllers')
//
router.get('/', getCategories)
//
module.exports = router
