const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

router.post(
    '/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов')
            .isLength({min: 6, max: 15})
    ],
    async (req, res) => {
        try {
            const error = validationResult(req)

            if (!error.isEmpty()) {
                return res.status(400).json({
                    errors: error.array(),
                    message: 'Некорректные данные при регистрации'
                })
            }
            const {name, email, phone, password} = req.body

            const candidate = await User.findOne({ email })

            if (candidate) {
                return res.status(400).json({message: 'Такой пользователь уже существует'})
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({name, email, phone, password: hashedPassword})

            await user.save()

            return res.status(201).json({message: 'Пользователь создан'})

        } catch (e) {

            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
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

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при входе в систему'
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({email})

            if (!user) {
                return res.status(400).json({message: 'Пользователь не найден'})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({message: 'Неверный пароль, попробуйте снова'})
            }

            const token = jwt.sign(
                {userId: user.id},
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            )

            res.json({token, userId: user.id, flag: true})
        } catch (e) {
            res.status(500).json({message: 'Что-то пошло не так, попробуйте снова'})
        }
    })
// TODO: Допилить запрос, возврат необходимых полей, какие поля изменить, условия их изменения и прочее

module.exports = router
