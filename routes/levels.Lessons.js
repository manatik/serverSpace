const { Router } = require('express')
const router = Router()
const elementaryLessons = require('../models/Lesson').elementaryLessons
const intermediateLessons = require('../models/Lesson').intermediateLessons
const preIntermediateLessons = require('../models/Lesson').preIntermediateLessons
const upperIntermediateLessons = require('../models/Lesson').upperIntermediateLessons
keysTitle = ['title1', 'title2', 'title3', 'title4']
keysImage = ['img1', 'img2', 'img3', 'img4']
levelsEng = new Map([
  ['Elementary', elementaryLessons],
  ['Intermediate', intermediateLessons],
  ['Pre-Intermediate', preIntermediateLessons],
  ['Upper-Intermediate', upperIntermediateLessons],
])

function getLevel(id) {
  return levelsEng.get(id)
}

router.post(
  '/lessons',
  async (req, res) => {
    try {
      const { id, limit, skip } = req.body
      if ( !id ) {
        res.json({message: 'Уровень английского не был получен'})
      }
      const result = getLevel(id)
      const count = Math.ceil(await result.countDocuments() / 4)
      const data = await result.find().limit(parseInt(limit)).skip(parseInt(skip))
      let getData = []
      for (let i = 0; i < data.length; i++) {
        getData[ i ] =
          { title: data[ i ].title, img: data[ i ].image, number: data[ i ].number }
      }
      res.json({ getData, count })
    } catch (e) {
      return res.json(e)
    }
  }
)

router.post(
  '/exercises',
  async (req, res) => {
    try {
      const { level, number } = req.body
      if (!level || !number) {
        res.json({message: 'Уровень или номер задания не были получены'})
      }
      const result = getLevel(level)
      const data = await result.findOne({ number })
      res.json(data)
    } catch (e) {
      return res.json(e)
    }
  }
)

module.exports = router
