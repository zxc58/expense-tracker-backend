/* eslint-disable no-unused-vars */
const bcryptjs = require('bcryptjs')
const supertest = require('supertest')
const db = require('../models')
const { User, Category, Record } = db
const categories = require('../Seed.json').categoryList
const authenticator = require('../middlewares/modules/authenticator')
let backEnd
beforeAll(async () => {
  jest.spyOn(authenticator, 'jwtAuthenticator')
  authenticator.jwtAuthenticator.mockImplementation((req, res, next) => {
    req.user = { id: 1, email: 'test@example.com', name: 'Mr.Test' }
    return next()
  })
  const app = require('../app')
  backEnd = supertest(app)
  const userData = { email: 'test@example.com', password: bcryptjs.hashSync('123456789'), name: 'Mr.Test' }
  categories.forEach(e => { e.iconClass = e.icon_class })
  await Promise.all([Category.bulkCreate(categories), User.create(userData)])
  return 'Init database (1 user, all categories)'
})

describe('CRUD record', () => {
  let categoryList, request, id

  beforeAll(async () => {
    categoryList = await Category.findAll({ raw: true, nest: true })
    request = (method, url, data) => {
      const withoutData = backEnd[method](url).set('Content-Type', 'application/json').set('Accept', 'application/json')
      if (method === 'post' || method === 'put') { return withoutData.send(data) } else if (method === 'get' || method === 'delete') { return withoutData }
    }
    return 'Sign in (get jwt) and connect with jwt, get category list'
  })

  test('Create record', async () => {
    const record = { name: 'test record', amount: 2, categoryId: categoryList.at(0).id, date: '1993-12-19' }
    const response = await request('post', '/records', record)
    id = JSON.parse(response?.text).postData.id
    const database = await Record.findByPk(id)
    expect(database.toJSON()).toMatchObject({ name: 'test record', amount: 2 })
  })

  test('Get all records', async () => {
    const response = await request('get', '/records')
    expect(JSON.parse(response?.text)).toMatchObject({ status: true, message: /get all record success/ })
  })

  test('Update record', async () => {
    const newRecord = { name: 'test record', amount: 20, categoryId: categoryList.at(1).id, date: '1993-01-19' }
    await request('put', `/records/${id}`, newRecord)
    const database = (await Record.findByPk(id)).toJSON()
    expect(database.amount).toBe(20)
  })

  test('Delete record', async () => {
    await request('delete', '/records/1')
    const response = await Record.findByPk(id)
    expect(response).toBeNull()
  })
})

afterAll(async () => {
  await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true })
  await Record.truncate()
  await User.truncate()
  await Category.truncate()
  await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true })
  await db.sequelize.close()
  return 'Clear and close database'
})
