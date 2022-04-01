//
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
//
function usePassport (app) {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const searchDbResult = await User.findOne({ email })
        if (!searchDbResult) {
          return done(null, false, req.flash('warningMessage', '此email沒被註冊'))
        }
        const passwordCompareResult = await bcrypt.compare(password, searchDbResult.password)
        if (!passwordCompareResult) {
          return done(null, false, req.flash('warningMessage', '密碼錯誤'))
        }
        return done(null, searchDbResult)
      } catch (error) {
        console.log(error)
      }
    })
  )
  //
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}
//
module.exports = usePassport
