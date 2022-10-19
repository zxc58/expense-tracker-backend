const express = require('express')
const router = express.Router()
//
const user = require('./modules/user')
const record = require('./modules/record')
const category = require('./modules/category')
const { authenticator: { jwtAuthenticator } } = require('../middlewares')
//
router.use('/users', user)
router.use('/records', jwtAuthenticator, record)
router.use('/categories', jwtAuthenticator, category)
router.use('/', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'content-type')
  res.end()
})
router.use((error, req, res, next) => {
  res.json({ status: false, message: error.message, error: error.stack })
})
//
module.exports = router
