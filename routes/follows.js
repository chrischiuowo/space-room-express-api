const express = require('express')
const router = express.Router()
const followController = require('../controllers/follow')
const { isAuth } = require('../middlewares/auth')

router.get('/follows_list', isAuth, followController.getFollowsList)

router.patch('/follows', isAuth, followController.toggleFollows)

module.exports = router
