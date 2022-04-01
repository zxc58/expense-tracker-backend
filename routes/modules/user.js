//
const express = require('express')
const router = express.Router()
const passport = require('passport')
const { userValidationGuard, antiAuthenticator } = require('../../middleWare')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')
//
router.get('/signin', antiAuthenticator, (req, res) => {
  res.render('signin')
})
router.post('/signin', antiAuthenticator, passport.authenticate('local', { successRedirect: '/', failureRedirect: '/user/signin' }))

router.get('/signup', antiAuthenticator, (req, res) => {
  res.render('signup')
})
router.post('/signup', antiAuthenticator, userValidationGuard, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() })
    }
    const searchResult = await User.findOne({ email: req.body.email })
    if (searchResult) {
      req.flash('warningMessage', 'email 已被註冊')
      return res.redirect('/user/signup')
    }
    const salt = bcrypt.genSaltSync(10)
    const hashPassword = bcrypt.hashSync(req.body.password, salt)
    req.body.password = hashPassword
    await User.create(req.body)
    return res.redirect('/')
  } catch (error) {
    console.log(error)
    return res.status(500).render('error')
  }
})
router.get('/signout', (req, res) => {
  req.logout()
  req.flash('successMessage', '登出成功')
  res.redirect('/user/signin')
})
//
module.exports = router
