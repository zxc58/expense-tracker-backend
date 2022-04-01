//
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const mongoose = require('mongoose')
const mongodbUri = process.env.MONGODB_URI
const db = mongoose.connection
//
mongoose.connect(mongodbUri)
db.on('error', () => console.log('An error occurred while connecting Mongodb'))
db.once('open', () => console.log('Mongodb connect success'))
//
module.exports = db
