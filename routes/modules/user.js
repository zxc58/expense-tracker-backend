const express = require('express')
const router = express.Router()
const passport = require('passport')
//
const {
  validator: { userValidationGuard },
  authenticator: { antiJwtAuthenticator, jwtAuthenticator }
} = require('../../middlewares')
const {
  userController: { signIn, signUp, getUser }
} = require('../../controllers')
//
router.post(
  '/signin',
  antiJwtAuthenticator,
  passport.authenticate('local', { session: false }),
  signIn
)
router.post('/signup', antiJwtAuthenticator, userValidationGuard, signUp)
router.get('/', jwtAuthenticator, getUser)
//
module.exports = router
