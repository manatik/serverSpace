const {Schema, model} = require('mongoose')

const schema = new Schema({
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    phone: {type: String, required: true},
    password: {type: String, required: true},
}, {collection: 'users'})


module.exports = model('User', schema)
