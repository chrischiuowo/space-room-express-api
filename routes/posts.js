const express = require('express')
const router = express.Router()
const postController = require('../controllers/post')
const { isAuth } = require('../middlewares/auth')

router.get('/posts', isAuth, postController.getPosts)

router.get('/post/1/:post_id', isAuth, postController.getOnlyPost)

router.get('/posts/user/:user_id', isAuth, postController.getUserPosts)

router.get('/posts/likes/:user_id', isAuth, postController.getPostLikes)

router.get('/posts/comments/:user_id', isAuth, postController.getPostComments)

router.post('/post/1', isAuth, postController.createPost)

router.patch('/post/1/:post_id', isAuth, postController.updatePost)

router.delete('/post/1/:post_id', isAuth, postController.deleteOnlyPost)

router.delete('/posts/user/:user_id', isAuth, postController.deleteUserPosts)

router.delete('/posts', isAuth, postController.deletePosts)

module.exports = router
