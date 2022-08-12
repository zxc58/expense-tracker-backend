// const { ensureAuthenticated } = require('../../helpers/user-helper')
const passport = require('passport')
// const authenticated = passport.authenticate('jwt', { session: false })
module.exports = {
  jwtAuthenticator: passport.authenticate('jwt', { session: false }),
  antiJwtAuthenticator: (req, res, next) => {
    if (req.get('Authorization')) {
      return next(new Error('Already sign in'))
    }
    return next()
  }
}
