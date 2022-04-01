//
const express = require('express')
const router = express.Router()
const user = require('./modules/user')
const record = require('./modules/record')
const home = require('./modules/home')
const { authenticator } = require('../middleWare')
//
router.use('/user', user)
router.use('/record', authenticator, record)
router.use('/', authenticator, home)
//
module.exports = router
