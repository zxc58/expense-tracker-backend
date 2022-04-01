//
const db = require('../../config/mongoose')
const Category = require('../category')
const { categoryList } = require('../../allSeed.json')
//
db.once('open', async () => {
  try {
    await Category.create(categoryList)
    console.log('Seeding categories success')
    process.exit()
  } catch (error) {
    console.log(error)
    process.exit()
  }
})
