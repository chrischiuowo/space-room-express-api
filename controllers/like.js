// Like Controller
const Post = require('../models/Post')
// const User = require('../models/User')
const successHandle = require('../service/successHandle')
const catchAsync = require('../service/catchAsync')
const appError = require('../service/appError')
const apiMessage = require('../service/apiMessage')

/*
  取得貼文按讚數量 GET
*/
const getPostLikes = catchAsync(async (req, res, next) => {
  const { post_id } = req.query

  if (!post_id) return next(appError(apiMessage.FIELD_FAILED, next))

  const data = await Post.findById(post_id).select('_id likes').populate({
    path: 'likes',
    select: 'name avatar'
  })

  if (!data) return next(appError(apiMessage.DATA_NOT_FOUND, next))

  successHandle({
    res,
    message: '取得貼文按讚數量成功',
    data: {
      like_length: data.likes.length,
      post_list: data
    }
  })
})

/*
  按讚貼文 與 取消讚貼文 PATCH
*/
const togglePostLikes = catchAsync(async (req, res, next) => {
  const { post_id, like_mode } = req.query
  const now_user_id = req.now_user_id
  const like_toggle = like_mode === 'add'
  let data

  if (!post_id || !like_mode) {
    return next(appError(apiMessage.FIELD_FAILED, next))
  }

  if (like_toggle) {
    data = await Post.findOneAndUpdate(
      { _id: post_id },
      {
        $addToSet: {
          likes: now_user_id
        }
      },
      { new: true }
    )
  } else {
    data = await Post.findOneAndUpdate(
      { _id: post_id },
      {
        $pull: {
          likes: now_user_id
        }
      },
      { new: true }
    )
  }

  if (!data) return next(appError(apiMessage.DATA_NOT_FOUND, next))

  if (like_toggle) {
    successHandle({
      res,
      message: '已成功按讚',
      data
    })
  } else {
    successHandle({
      res,
      message: '已取消按讚',
      data
    })
  }
})

module.exports = {
  getPostLikes,
  togglePostLikes
}
