//
const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const { recordValidationGuard } = require('../../middleWare')
const { validationResult } = require('express-validator')
const moment = require('moment')
//
router.get('/new', async (req, res) => {
  res.locals.title = 'New Record'
  res.locals.action = '/record'
  res.locals.categoryList = await Category.find().lean().sort({ _id: 1 })
  return res.render('record')
})
router.post('/', recordValidationGuard, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() })
    }
    req.body.userId = req.user._id
    await Record.create(req.body)
    return res.redirect('/')
  } catch (error) {
    console.log(error)
    return res.status(500).render('error')
  }
})
router.get('/:_id/edit', async (req, res) => {
  try {
    const _id = req.params._id
    const userId = req.user._id
    const [searchResult, categoryList] = await Promise.all([
      Record.findOne({ _id, userId }).populate(['userId', 'categoryId']).lean(),
      Category.find().lean().sort({ _id: 1 })
    ])
    if (!searchResult) {
      return res.status(500).render('error')
    }
    searchResult.date = moment(searchResult.date).format('YYYY-MM-DD')
    for (const category of categoryList) {
      if (category.name === searchResult.categoryId.name) {
        category.selected = 'selected'
      } else { category.selected = '' }
    }
    res.locals.title = 'Edit Record'
    res.locals.action = `/record/${_id}?_method=PUT`
    res.locals.searchResult = searchResult
    res.locals.categoryList = categoryList
    return res.render('record')
  } catch (error) {
    console.log(error)
    return res.status(500).render('error')
  }
})
router.put('/:_id', recordValidationGuard, async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(500).json({ errors: errors.array() })
    }
    const _id = req.params._id
    const userId = req.user._id
    const searchResult = await Record.findOneAndUpdate({ _id, userId }, req.body)
    if (!searchResult) {
      return res.status(500).render('error')
    }
    return res.redirect('/')
  } catch (error) {
    console.log(error)
    return res.status(500).render('error')
  }
})
router.delete('/:_id', async (req, res) => {
  try {
    const _id = req.params._id
    const userId = req.user._id
    const searchResults = await Record.findOneAndDelete({ _id, userId })
    if (!searchResults) {
      return res.status(500).render('error')
    }
    return res.redirect('/')
  } catch (error) {
    console.log(error)
    return res.status(500).render('error')
  }
})
//
module.exports = router
