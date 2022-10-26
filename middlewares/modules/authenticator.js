const passport = require('passport')
const authenticator = {
  jwtAuthenticator: (req, res, next) =>
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        return res.status(401).json({ status: false, message: 'Wrong error' })
      }
      req.user = user
      return next()
    })(req, res, next),
  antiJwtAuthenticator: (req, res, next) => {
    if (req.get('Authorization')) {
      return next(new Error('Already sign in'))
    }
    return next()
  }
}
module.exports = authenticator
