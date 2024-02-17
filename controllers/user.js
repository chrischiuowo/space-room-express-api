const User = require('../models/User')
const Post = require('../models/Post')
const successHandle = require('../service/successHandle')
const catchAsync = require('../service/catchAsync')
const appError = require('../service/appError')
const apiMessage = require('../service/apiMessage')

/*
  最新通知資訊 GET (貼文, 留言, 追蹤)
*/
const getUserNotice = catchAsync(async (req, res, next) => {
  const now_user_id = req.now_user_id

  if (!now_user_id) {
    return next(appError(apiMessage.FIELD_FAILED, next))
  }

  // 追蹤名單
  const followingLists = await User.find({ _id: now_user_id })
    .select('followings followers')
    .populate({
      path: 'followings.user',
      select: '_id name'
    })
    .populate({
      path: 'followers.user',
      select: '_id name'
    })

  if (!followingLists) return next(appError(apiMessage.DATA_NOT_FOUND, next))

  // 最新的 15 筆貼文
  const newPosts = await Post.find({}).select('_id user createdAt').limit(15).populate({
    path: 'user',
    select: '_id name'
  })

  if (!newPosts) return next(appError(apiMessage.DATA_NOT_FOUND, next))

  // 使用者貼文的留言
  const commentPosts = await Post.find({ user: now_user_id }).select('_id comment').populate({
    path: 'comments',
    select: 'post user createdAt'
  })

  if (!commentPosts) return next(appError(apiMessage.DATA_NOT_FOUND, next))

  const postData = newPosts.filter(({ user: user1 }) =>
    followingLists[0].followings.some(({ user: user2 }) => user2.equals(user1._id))
  )
  const followerData = followingLists[0].followers.sort(function (a, b) {
    return b.createdAt - a.createdAt
  })
  let commentsData = []
  let repliesData = []
  commentPosts.forEach((data) => {
    if (data.comments?.length) {
      commentsData = data.comments.sort(function (a, b) {
        return b.createdAt - a.createdAt
      })
      data.comments.forEach((data2) => {
        if (data2.commentReplies?.length) {
          repliesData = data2.commentReplies.sort(function (a, b) {
            return b.createdAt - a.createdAt
          })
        }
      })
    }
  })
  commentsData = commentsData.filter((data) => !data.user._id.equals(now_user_id))
  repliesData = repliesData.filter((data) => !data.user._id.equals(now_user_id))

  successHandle({
    res,
    message: '取得最新通知成功',
    data: {
      postData,
      followerData,
      commentsData,
      repliesData
    }
  })
})

/*
  個人貼文牆資訊 GET
*/
const getUserProfile = catchAsync(async (req, res, next) => {
  const { user_id } = req.params

  if (!user_id) {
    return next(appError(apiMessage.FIELD_FAILED, next))
  }

  const postData = await Post.find({ user: user_id })
    .populate({
      path: 'user',
      select: 'name avatar'
    })
    .populate({
      path: 'comments',
      options: { sort: { createdAt: -1 } }
    })
    .sort('-createdAt')

  if (!postData) return next(appError(apiMessage.DATA_NOT_FOUND, next))

  const userData = await User.findById(user_id)

  if (!userData) return next(appError(apiMessage.DATA_NOT_FOUND, next))

  successHandle({
    res,
    message: '取得使用者貼文牆資料成功',
    data: {
      user: userData,
      post: postData
    }
  })
})

/*
  隨機搜尋使用者 GET
*/
const getRandomUsers = catchAsync(async (req, res, next) => {
  const count = await User.estimatedDocumentCount()
  const random = count <= 5 ? 0 : Math.floor(Math.random() * count)

  const data = await User.find().skip(random).limit(5)

  if (!data) return next(appError(apiMessage.DATA_NOT_FOUND, next))

  successHandle({
    res,
    message: '隨機取得使用者成功',
    data
  })
})

/*
  搜尋使用者 GET
*/
const getUsers = catchAsync(async (req, res, next) => {
  // su => 搜尋使用者
  const { q } = req.query
  const query = q ? { name: new RegExp(q) } : {}

  const data = await User.find(query)

  if (!data) return next(appError(apiMessage.DATA_NOT_FOUND, next))

  successHandle({
    res,
    message: '取得使用者成功',
    data
  })
})

/*
  取得目前使用者資訊 GET
*/
const getUserInfo = catchAsync(async (req, res, next) => {
  const { user_id } = req.params

  if (!user_id) return next(appError(apiMessage.FIELD_FAILED, next))

  const data = await User.findById(user_id)

  if (!data) return next(appError(apiMessage.DATA_NOT_FOUND, next))

  successHandle({
    res,
    message: '取得使用者資料成功',
    data
  })
})

/*
  更新使用者資訊 PATCH
*/
const updateUserInfo = catchAsync(async (req, res, next) => {
  const { user_id } = req.params
  let { name, avatar } = req.body
  const new_data = {}
  name = name.trim()

  if (!user_id) return next(appError(apiMessage.FIELD_FAILED, next))

  if (name !== undefined && name?.length >= 2) {
    new_data.name = name
  } else {
    return next(
      appError(
        {
          message: '暱稱至少 ２ 字元以上',
          statusCode: 400
        },
        next
      )
    )
  }

  if (avatar !== undefined) {
    new_data.avatar = avatar
  }

  const data = await User.findByIdAndUpdate(user_id, new_data, {
    runValidators: true,
    new: true
  })
  if (!data) {
    return next(appError(apiMessage.DATA_NOT_FOUND, next))
  }

  successHandle({ res, message: '更新使用者資料成功', data })
})

/*
  刪除目前使用者資訊 DELETE
*/
const deleteUserInfo = catchAsync(async (req, res, next) => {
  const { user_id } = req.params

  if (!user_id) return next(appError(apiMessage.FIELD_FAILED, next))

  const data = await User.findByIdAndDelete(user_id)

  if (!data) return next(appError(apiMessage.DATA_NOT_FOUND, next))

  successHandle({
    res,
    message: '刪除使用者資料成功',
    data
  })
})

module.exports = {
  getUserNotice,
  getUserProfile,
  getRandomUsers,
  getUsers,
  getUserInfo,
  deleteUserInfo,
  updateUserInfo
}
