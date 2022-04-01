//
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
require('./config/mongoose')
const express = require('express')
const session = require('express-session')
const methodOverride = require('method-override')
const { engine } = require('express-handlebars')
const flash = require('connect-flash')
const usePassport = require('./config/passport')
const router = require('./routes/index')
const app = express()
//
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
usePassport(app)
app.use(flash(), (req, res, next) => {
  res.locals.successMessage = req.flash('successMessage')
  res.locals.warningMessage = req.flash('warningMessage')
  next()
})
app.use(express.static('public'))
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use('/', router)

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.PORT}`)
})
