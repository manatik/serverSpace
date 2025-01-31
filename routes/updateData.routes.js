const { Router } = require('express')
const router = Router()
const ID = require('../models/FindUserByID')
const {check, validationResult} = require('express-validator')
const progressLesson = require('../models/Progress')
const _ = require('lodash')

router.post(
  '/update',
  check('email', 'Введите корректный E-mail').normalizeEmail().isEmail(),
  check('name', 'Некорректное имя пользователя').not().isEmpty().isLength({min: 5}),
  check('phone', 'Некорректный номер').not().isEmpty().isMobilePhone('ru-RU'),
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const err = errors.array()
        return res.status(400).json({message: err[0].msg})
      }
      const { id, name, email, phone } = req.body
      const updateData = {}
      if (name) {
        updateData.name = name
      }
      if (email) {
        updateData.email = email
      }
      if (phone) {
        updateData.phone = phone
      }
      const user = await ID.updateOne(
        { _id: id },
        { $set: updateData }
      )

      if ( !user ) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }
      return res.json({ message: 'Данные обновлены' })

    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })

router.post(
  '/data',
  async (req, res) => {
    try {
      const { id } = req.body

      const user = await ID.findOne({ _id: id })

      const data = {
        imageProfile: user.image,
        name: user.name,
        email: user.email,
        phone: user.phone
      }

      return res.json({ message: 'Данные найдены и загружены', data })
    } catch (e) {

      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })

router.post(
  '/progress',
  async (req, res) => {
    try {
      const { id } = req.body
      const result = await progressLesson.findOne({ userId: id })
      const object = {
        Elementary: result.Elementary,
        Intermediate: result.Intermediate,
        PreIntermediate: result.PreIntermediate,
        UpperIntermediate: result.UpperIntermediate
      }

      const nameLevel = {
        Elementary: {
          name: "Elementary"
        },
        Intermediate: {
          name: "Intermediate"
        },
        PreIntermediate: {
          name: "Pre-Intermediate"
        },
        UpperIntermediate: {
          name: "Upper-Intermediate"
        }
      }

      const __data = _.reduce(object, (result, level, key) => {
        const levelArray = []

        _.map(level, item => levelArray.push(...item))

        result[key] = {
          all: levelArray.length,
          completed: _.compact(levelArray).length,
          ...nameLevel[key]
        }

        return result
      }, {})

      res.json(__data)
    } catch (e) {

    }
  })
module.exports = router
