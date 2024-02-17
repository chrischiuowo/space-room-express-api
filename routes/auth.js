const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const { isAuth } = require('../middlewares/auth')

router.post('/auth/signup', authController.signup)

router.post('/auth/login', authController.login)

router.post('/auth/logout', authController.logout)

router.patch('/auth/reset_password', isAuth, authController.updatePassword)

router.get('/auth/check', authController.checkToken)

module.exports = router
