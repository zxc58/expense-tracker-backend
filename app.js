if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
require('./models')
const express = require('express')
const cors = require('cors')
//
const usePassport = require('./config/passport')
const router = require('./routes')
//
const app = express()
//
app.use(cors())
app.use(express.json())
usePassport(app)
app.use('/', router)
//
if (process.env.NODE_ENV !== 'test') {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`http://localhost:${process.env.PORT}`)
  })
}
//
module.exports = app
