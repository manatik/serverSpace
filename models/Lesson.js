const {Schema, model} = require('mongoose')

const lessonsModel = new Schema({
  title: {type: String},
  image: {type: String},
  number: {type: Number},
  words: {type: Object},
  sentence: {type: Object}
})

let lvl1 = model('elementaryLessons', lessonsModel, 'elementaryLessons')
let lvl2 = model('intermediateLessons', lessonsModel, 'intermediateLessons')
let lvl3 = model('preIntermediateLessons', lessonsModel, 'preIntermediateLessons')
let lvl4 = model('upperIntermediateLessons', lessonsModel, 'upperIntermediateLessons')

module.exports = {
  elementaryLessons : lvl1,
  intermediateLessons: lvl2,
  preIntermediateLessons: lvl3,
  upperIntermediateLessons: lvl4
}
