const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
//
const { User } = require('../../models')
//
const userController = {
  signIn: async (req, res, next) => {
    try {
      const { id } = req.user
      const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })
      return res.json({ status: true, message: 'get jwt token', token })
    } catch (error) {
      console.log(error)
      next(error)
    }
  },
  signUp: async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(500).json({ errors: errors.array() })
      }
      const { email, name, password } = req.body
      const searchResult = await User.findOne({ where: { email } })
      if (searchResult) {
        return res.json({ status: false, message: 'email 已被註冊' })
      }
      const hashPassword = bcrypt.hashSync(password)
      await User.create({ email, name, password: hashPassword })
      return res.json({ status: true, message: '成功註冊' })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'error' })
    }
  },
  getUser: (req, res, next) => {
    return res.json({ status: true, message: 'get user data', user: req.user })
  }
}

module.exports = userController
