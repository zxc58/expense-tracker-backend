//
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// require('./config/mongoose')
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
app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`)
})
