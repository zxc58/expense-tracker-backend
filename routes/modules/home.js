//
const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const moment = require('moment')
//
router.get('/', async (req, res) => {
  try {
    const findCondition = { userId: req.user._id }
    let totalAmount = 0
    if (req.query.filterByCategory) { findCondition.categoryId = req.query.filterByCategory }
    const [categoryList, recordList] = await Promise.all([
      Category.find().lean().sort({ _id: 1 }),
      Record.find(findCondition).populate(['userId', 'categoryId']).lean().sort({ date: -1 })
    ])
    for (const category of categoryList) {
      if (category._id == req.query.filterByCategory) {
        category.selected = 'selected'
      } else { category.selected = '' }
    }
    for (const record of recordList) {
      record.date = moment(record.date).format('YYYY-MM-DD')
      totalAmount += record.amount
    }
    res.locals.totalAmount = totalAmount
    res.locals.searchResults = recordList
    res.locals.categoryList = categoryList
    res.render('home')
  } catch (error) {
    console.log(error)
    return res.status(500).render('error')
  }
})
//
module.exports = router
