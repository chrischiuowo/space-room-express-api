const User = require('../models/User')
const catchAsync = require('../service/catchAsync')
const appError = require('../service/appError')
const apiMessage = require('../service/apiMessage')
const jwt = require('jsonwebtoken')

/*
  驗證是否登入
*/
const isAuth = catchAsync(async (req, res, next) => {
  // 確認 token
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    return next(appError(apiMessage.LOGIN_FAILED, next))
  }

  // 驗證 token 正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET, (err, payload) => {
      if (err) {
        return next(appError(apiMessage.TOKEN_FAILED, next))
      } else {
        resolve(payload)
      }
    })
  })

  // 找到使用者
  User.findById(decoded.id, function (findErr, findRes) {
    if (findErr) {
      return next(appError(apiMessage.LOGIN_FAILED, next))
    } else {
      req.now_user_id = findRes._id
      next()
    }
  })
})

module.exports = {
  isAuth
}
