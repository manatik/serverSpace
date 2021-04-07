const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
  id: {type: String},
  image: {type: String},
  name: {type: String},
  email: {type: String},
  phone: {type: String},
  google: {type: String},
  vk: {type: String}
}, {collection: 'users'})

module.exports = model('FindId', schema)
