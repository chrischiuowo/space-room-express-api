const express = require('express')
const router = express.Router()
const commentController = require('../controllers/comment')
const { isAuth } = require('../middlewares/auth')

router.get('/comments/:post_id', isAuth, commentController.getComments)

router.post('/comment/1/:post_id', isAuth, commentController.postComment)

router.patch('/comment/1/:comment_id', isAuth, commentController.updateComment)

router.delete('/comment/1/:comment_id', isAuth, commentController.deleteComment)

router.post('/comment/reply/1/:post_id/:comment_id', isAuth, commentController.postCommentReply)

router.patch('/comment/reply/1/:reply_id', isAuth, commentController.updateCommentReply)

router.delete('/comment/reply/1/:reply_id', isAuth, commentController.deleteCommentReply)

module.exports = router
