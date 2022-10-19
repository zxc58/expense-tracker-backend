const app = require('../app')
const supertest = require('supertest')
const db = require('../models')
const backEnd = supertest(app)
afterAll(async () => {
  try {
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true })
    await db.User.truncate()
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true })
    await db.sequelize.close()
    return 'Test finish'
  } catch (error) {
    console.error(error)
  }
})

describe('測試註冊功能', () => {
  const data = { email: 'test@example.com', password: '123456789', name: 'Mr.Test' }
  test('Sign up normally', async () => {
    try {
      const response = await backEnd
        .post('/users/signup').send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(response?.text).toMatch(/成功註冊/)
    } catch (error) { console.error(error) }
  })
  test('Using registed email', async () => {
    try {
      const response = await backEnd
        .post('/users/signup').send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(response?.text).toMatch(/email 已被註冊/)
    } catch (error) { console.error(error) }
  })
  test('Using invalid value', async () => {
    try {
      delete data.name
      const response = await backEnd
        .post('/users/signup').send(data)
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(response?.text).toMatch(/Invalid value/)
    } catch (error) { console.error(error) }
  })
})

describe('測試登入功能', () => {
  const data = { email: 'test@example.com', password: '123456789' }
  test('Sign in normally', async () => {
    try {
      const response = await backEnd.post('/users/signin')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json').send(data)
      expect(response?.text).toMatch(/get jwt token/)
    } catch (error) { console.error(error) }
  })
  test('Wrongs password', async () => {
    try {
      data.password = '0123456789'
      const response = await backEnd.post('/users/signin')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json').send(data)
      expect(response?.text).toMatch(/Unauthorized/)
    } catch (error) { console.error(error) }
  })
})
