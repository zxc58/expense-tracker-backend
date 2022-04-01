//
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const bcrypt = require('bcryptjs')
const db = require('../../config/mongoose')
const Record = require('../record')
const User = require('../user')
const Category = require('../category')
const { userList, recordList } = require('../../allSeed.json')
//
db.once('open', () => {
  Promise.all(userList.map(user => bcrypt.genSalt(10).then(salt => bcrypt.hash(user.password, salt)).then(hash => { user.password = hash }))
  ).then(() => {
    Promise.all([User.create(userList), Category.find().sort({ _id: 1 })])
      .then(resultArray => {
        const [userArray, categoryArray] = resultArray
        recordList.forEach(record => {
          record.userId = userArray[record.userId - 1]._id
          record.categoryId = categoryArray[record.categoryId - 1]._id
        })
        Record.create(recordList)
          .then(() => {
            console.log('Seeding records/users success')
            process.exit()
          }).catch(error => {
            console.log(error)
            process.exit()
          })
      }).catch(error => {
        console.log(error)
        process.exit()
      })
  }).catch(error => {
    console.log(error)
    process.exit()
  })
})
