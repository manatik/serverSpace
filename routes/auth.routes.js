const { Router } = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const router = Router()
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const progressLessons = require('../models/Progress')
const {
  elementaryLessons,
  upperIntermediateLessons,
  preIntermediateLessons,
  intermediateLessons
} = require('../models/Lesson')
const _ = require('lodash')


router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов')
      .isLength({ min: 6, max: 15 })
  ],
  async (req, res) => {
    try {
      const error = validationResult(req)

      if ( !error.isEmpty() ) {
        return res.status(400).json({
          errors: error.array(),
          message: 'Некорректные данные при регистрации'
        })
      }
      const { name, email, phone, password } = req.body

      const candidate = await User.findOne({ email })

      if ( candidate ) {
        return res.status(400).json({ message: 'Такой пользователь уже существует' })
      }

      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({ name, email, phone, password: hashedPassword, online: false })

      await user.save()

      const data = await User.findOne({ email })
      const userId = data._id

      const elem = await elementaryLessons.find()
      const inter = await intermediateLessons.find()
      const pre = await preIntermediateLessons.find()
      const upp = await upperIntermediateLessons.find()

      const obj2 = {
        Elementary: elem.length,
        Intermediate: inter.length,
        PreIntermediate: pre.length,
        UpperIntermediate: upp.length
      }
      const obj = {
        Elementary: {},
        Intermediate: {},
        PreIntermediate: {},
        UpperIntermediate: {}
      }

      _.reduce(obj2, (result, value, key) => {

        for (let i = 1; i <= value; i++) {
          obj[key][i] = [0,0]
        }
        return result
      }, {})


      const progress = await new progressLessons({
        userId: userId,
        Elementary: obj.Elementary,
        Intermediate: obj.Intermediate,
        PreIntermediate: obj.PreIntermediate,
        UpperIntermediate: obj.UpperIntermediate
      })

      progress.save()

      return res.status(201).json({ message: 'Пользователь создан' })
    } catch (e) {

      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })


router.post(
  '/login',
  [
    check('email', 'Введите корректный E-mail').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)

      if ( !errors.isEmpty() ) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Некорректные данные при входе в систему'
        })
      }

      const { email, password } = req.body

      const user = await User.findOne({ email })

      if ( !user ) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if ( !isMatch ) {
        return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
      }

      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecret'),
        { expiresIn: '1h' }
      )

      res.json({ token, userId: user.id, flag: true })
    } catch (e) {
      res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
    }
  })
// TODO: Допилить запрос, возврат необходимых полей, какие поля изменить, условия их изменения и прочее

module.exports = router
