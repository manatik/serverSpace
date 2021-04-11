const {Schema, model} = require('mongoose')

const lessonsProgress = new Schema({
  userId: {type: String},
  Elementary: {type: Object},
  Intermediate: {type: Object},
  PreIntermediate: {type: Object},
  UpperIntermediate: {type: Object}
})

module.exports = model('progress', lessonsProgress, 'progress')
