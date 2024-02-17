const express = require('express')
const router = express.Router()
const likeController = require('../controllers/like')
const { isAuth } = require('../middlewares/auth')

router.get('/likes', isAuth, likeController.getPostLikes)

router.patch('/likes', isAuth, likeController.togglePostLikes)

module.exports = router
