const { Category } = require('../../models')
const categoryController = {
  getCategories: async (req, res, next) => {
    try {
      const categories = await Category.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        raw: true,
        nest: true
      })
      const message = 'Get all categories'
      res.json({ status: true, message, categories })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }
}
module.exports = categoryController
