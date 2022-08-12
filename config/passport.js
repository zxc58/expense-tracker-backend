const passport = require('passport')
const LocalStrategy = require('passport-local')
const passportJWT = require('passport-jwt')
const bcrypt = require('bcryptjs')
//
const { User } = require('../models')
//
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}
//
function usePassport (app) {
  app.use(passport.initialize())
  passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } })
        if (!user) {
          return done(null, false)
        }
        const passwordCompareResult = await bcrypt.compare(password, user.password)
        if (!passwordCompareResult) {
          return done(null, false)
        }
        return done(null, user.toJSON())
      } catch (error) {
        console.log(error)
      }
    })
  )
  //
  passport.use(new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await User.findByPk(jwtPayload.id, {
        attributes: ['id', 'name', 'email']
      })
      if (user) {
        return done(null, user.toJSON())
      } else {
        done(new Error('jwt wrong'))
      }
    } catch (error) {
      done(error)
    }
  }))
  //
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      const user = (await User.findByPk(id, { exclude: ['password', 'createdAt', 'updatedAt'] })).toJSON()
      return done(null, user)
    } catch (error) {
      done(error, null)
    }
  })
}
//
module.exports = usePassport
