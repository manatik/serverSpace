const { Router } = require('express')
const router = Router()
const
  {
    elementaryLessons, upperIntermediateLessons,
    preIntermediateLessons, intermediateLessons
  } = require('../models/Lesson')
const progressLesson = require('../models/Progress')

levelsEng = new Map([
  ['Elementary', elementaryLessons],
  ['Intermediate', intermediateLessons],
  ['Pre-Intermediate', preIntermediateLessons],
  ['Upper-Intermediate', upperIntermediateLessons],
])
function getLevel(level) {
  return levelsEng.get(level)
}
function progressUserFunc (progress, id) {
  const stars = new Map([
    ['Elementary', progress.Elementary],
    ['Intermediate', progress.Intermediate],
    ['Pre-Intermediate', progress.PreIntermediate],
    ['Upper-Intermediate', progress.UpperIntermediate],
  ])
  return stars.get(id)
}

router.post(
  '/lessons',
  async (req, res) => {
    try {
      const { id, limit, skip, userId } = req.body
      if ( !id ) {
        res.json({ message: 'Уровень английского не был получен' })
      }
      const result = getLevel(id)
      const count = Math.ceil(await result.countDocuments() / 4)
      const data = await result.find().limit(parseInt(limit)).skip(parseInt(skip))
      const progress = await progressLesson.findOne({userId})
      const str = progressUserFunc(progress, id)
      let getData = []
      for (let i = 0; i < data.length; i++) {
        getData[ i ] =
          { title: data[ i ].title, img: data[ i ].image, number: data[ i ].number }
      }
      res.json({ getData, count, str })
    } catch (e) {
      return res.json(e)
    }
  }
)

router.post(
  '/words',
  async (req, res) => {
    try {
      const { level, number } = req.body
      if ( !level || !number ) {
        res.json({ message: 'Произошла ошибка. Слова не были получены' })
      }
      const result = getLevel(level)
      const data = await result.findOne({ number })
      res.json(data.words)
    } catch (e) {
      return res.json(e)
    }
  }
)

router.post(
  '/sentences',
  async (req, res) => {
    try {
      const { level, number } = req.body
      if ( !level || !number ) {
        res.json({ message: 'Произошла ошибка. Предложения не были получены' })
      }
      const result = getLevel(level)
      const data = await result.findOne({ number })
      res.json(data.sentence)
    } catch (e) {
      return res.json(e)
    }
  }
)

router.post(
  '/progress',
  async (req, res) => {
    try {
      const { userId, number, level, passWords, passSentences } = req.body

      const result = await progressLesson.findOne({ userId })

      switch (level) {
        case 'Elementary':
          let arr = result.Elementary[ number ]
          if ( !arr[ 0 ] && arr[ 1 ] )
            result.Elementary[ number ] = [passWords, 1]
          if ( arr[ 0 ] && !arr[ 1 ] )
            result.Elementary[ number ] = [1, passSentences]
          if ( !arr[ 0 ] && !arr[ 1 ] )
            result.Elementary[ number ] = [passWords, passSentences]
          break;
        case 'Intermediate':
          let arr2 = result.Intermediate[ number ]
          if ( !arr2[ 0 ] && arr2[ 1 ] )
            result.Intermediate[ number ] = [passWords, 1]
          if ( arr2[ 0 ] && !arr2[ 1 ] )
            result.Intermediate[ number ] = [1, passSentences]
          if ( !arr2[ 0 ] && !arr2[ 1 ] )
            result.Intermediate[ number ] = [passWords, passSentences]
          break;
        case 'Pre-Intermediate':
          let arr3 = result.PreIntermediate[ number ]
          if ( !arr3[ 0 ] && arr3[ 1 ] )
            result.PreIntermediate[ number ] = [passWords, 1]
          if ( arr3[ 0 ] && !arr3[ 1 ] )
            result.PreIntermediate[ number ] = [1, passSentences]
          if ( !arr3[ 0 ] && !arr3[ 1 ] )
            result.PreIntermediate[ number ] = [passWords, passSentences]
          break;
        case 'Upper-Intermediate':
          let arr4 = result.UpperIntermediate[ number ]
          if ( !arr4[ 0 ] && arr4[ 1 ] )
            result.UpperIntermediate[ number ] = [passWords, 1]
          if ( arr4[ 0 ] && !arr4[ 1 ] )
            result.UpperIntermediate[ number ] = [1, passSentences]
          if ( !arr4[ 0 ] && !arr4[ 1 ] )
            result.UpperIntermediate[ number ] = [passWords, passSentences]
          break;
        default:
          res.json({ message: 'Что-то пошло не так :(' })
      }

      await progressLesson.updateOne({ userId }, result)

      res.status(200).json({ message: 'Всё ок'})
    } catch (e) {
      res.status(500).json({ message: e })
    }
  }
)
module.exports = router
