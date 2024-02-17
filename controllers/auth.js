// Auth Controller
const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const User = require('../models/User')
const successHandle = require('../service/successHandle')
const catchAsync = require('../service/catchAsync')
const appError = require('../service/appError')
const apiMessage = require('../service/apiMessage')

/*
  註冊功能 POST
*/
const signup = catchAsync(async (req, res, next) => {
  let { name, email, password, confirmPassword } = req.body
  const err_code = 400
  name = name.trim()

  // 驗證項目不得為空
  if (!name || !email || !password || !confirmPassword) {
    return next(
      appError(
        {
          message: '填入項目不得為空',
          statusCode: err_code
        },
        next
      )
    )
  }
  // 驗證名字超過兩位數
  if (name.length < 2) {
    return next(
      appError(
        {
          message: '名字至少 ２ 字元以上',
          statusCode: err_code
        },
        next
      )
    )
  }
  // 驗證信箱格式
  if (!validator.isEmail(email)) {
    return next(
      appError(
        {
          message: 'Email 格式錯誤',
          statusCode: err_code
        },
        next
      )
    )
  }
  // 驗證密碼是否中英混合
  if (!/(?=\w*\d)(?=\w*[a-zA-Z])\w+/.test(password)) {
    return next(
      appError(
        {
          message: '密碼應該為中英混合',
          statusCode: err_code
        },
        next
      )
    )
  }
  if (!validator.isLength(password, { min: 8 })) {
    return next(
      appError(
        {
          message: '密碼至少 8 碼以上',
          statusCode: err_code
        },
        next
      )
    )
  }
  // 驗證密碼是否超過８位數
  if (!validator.isLength(password, { min: 8 })) {
    return next(
      appError(
        {
          message: '密碼至少 8 碼以上',
          statusCode: err_code
        },
        next
      )
    )
  }
  // 驗證密碼是否一致
  if (password !== confirmPassword) {
    return next(
      appError(
        {
          message: '密碼不一致',
          statusCode: err_code
        },
        next
      )
    )
  }

  await User.findOne({ email }, '_id name email').exec((findErr, findRes) => {
    if (findErr) {
      return next(appError(apiMessage.INTERNAL_SERVER_ERROR, next))
    }
    if (findRes !== null) {
      return next(
        appError(
          {
            message: '此信箱已經被使用',
            statusCode: err_code
          },
          next
        )
      )
    }
  })

  // 加密密碼
  password = await bcrypt.hash(password, 12)
  // 建立
  const createData = await User.create({
    name,
    email,
    password
  })
  return successHandle({
    res,
    message: '註冊成功',
    data: {
      _id: createData._id,
      name: createData.name,
      email: createData.email
    }
  })
})

/*
  登入功能 POST
*/
const login = catchAsync(async (req, res, next) => {
  let { email, password } = req.body
  const err_code = 400

  // 驗證項目不得為空
  if (!email || !password) {
    return next(
      appError(
        {
          message: '填入項目不得為空',
          statusCode: err_code
        },
        next
      )
    )
  }
  // 驗證信箱格式
  if (!validator.isEmail(email)) {
    return next(
      appError(
        {
          message: 'Email 格式錯誤',
          statusCode: err_code
        },
        next
      )
    )
  }
  // 驗證密碼是否超過８位數
  if (!validator.isLength(password, { min: 8 })) {
    return next(
      appError(
        {
          message: '密碼至少 8 碼以上',
          statusCode: err_code
        },
        next
      )
    )
  }

  // 嘗試登入
  User.findOne({ email })
    .select('+password')
    .exec(async (findErr, findRes) => {
      // 驗證資料
      if (findErr) {
        return next(appError(apiMessage.INTERNAL_SERVER_ERROR, next))
      }

      if (findRes === null) {
        return next(
          appError(
            {
              message: '帳號錯誤，請重新輸入',
              statusCode: err_code
            },
            next
          )
        )
      }

      const passwordCheck = await bcrypt.compare(password, findRes.password)
      if (!passwordCheck) {
        return next(
          appError(
            {
              message: '密碼錯誤，請重新輸入',
              statusCode: err_code
            },
            next
          )
        )
      }
      password = undefined

      // 產生token
      const token = jwt.sign(
        {
          id: findRes._id
        },
        process.env.SECRET,
        {
          algorithm: 'HS256',
          expiresIn: process.env.EXPIRES_IN
        }
      )

      // 存入token
      res.setHeader('token', token)

      return successHandle({
        res,
        message: '登入成功',
        data: {
          user: {
            _id: findRes._id,
            name: findRes.name,
            email: findRes.email
          },
          token
        }
      })
    })
})

/*
  登出功能 POST
*/
const logout = catchAsync(async (req, res, next) => {
  successHandle({
    res,
    message: '登出成功'
  })
})

/*
  更新密碼 PATCH
*/
const updatePassword = catchAsync(async (req, res, next) => {
  const { password, confirm_password } = req.body
  const now_user_id = req.now_user_id
  const err_code = 400
  // 驗證項目不得為空
  if (!password || !confirm_password) {
    return next(
      appError(
        {
          message: '填入項目不得為空',
          statusCode: err_code
        },
        next
      )
    )
  }
  // 驗證密碼是否中英混合
  if (!/(?=\w*\d)(?=\w*[a-zA-Z])\w+/.test(password)) {
    return next(
      appError(
        {
          message: '密碼應該為中英混合',
          statusCode: err_code
        },
        next
      )
    )
  }
  // 驗證密碼是否超過８位數
  if (!validator.isLength(password, { min: 8 })) {
    return next(
      appError(
        {
          message: '密碼至少 8 碼以上',
          statusCode: err_code
        },
        next
      )
    )
  }
  // 驗證密碼是否一致
  if (password !== confirm_password) {
    return next(
      appError(
        {
          message: '密碼不一致',
          statusCode: err_code
        },
        next
      )
    )
  }

  // 加密密碼
  const new_password = await bcrypt.hash(password, 12)

  // 更新
  const data = await User.findByIdAndUpdate(now_user_id, { password: new_password }, { new: true, runValidators: true })
  if (!data) {
    return next(appError(apiMessage.DATA_NOT_FOUND, next))
  }
  successHandle({
    res,
    message: '更新密碼成功'
  })
})

/*
  驗證token GET
*/
const checkToken = catchAsync(async (req, res, next) => {
  // 確認 token
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    return next(
      appError(
        {
          message: 'token 不存在',
          statusCode: 400
        },
        next
      )
    )
  }

  // 驗證 token 正確性
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.SECRET, (err, payload) => {
      if (err) {
        return next(
          appError(
            {
              message: 'token 驗證失敗',
              statusCode: 400
            },
            next
          )
        )
      }
      resolve(payload)
    })
  })

  // 找到使用者
  User.findById(decoded.id, (findErr, findRes) => {
    if (findErr) {
      return next(
        appError(
          {
            message: '找不到使用者',
            statusCode: 400
          },
          next
        )
      )
    }
    return successHandle({
      res,
      message: 'token 驗證成功',
      data: findRes
    })
  })
})

module.exports = {
  login,
  signup,
  logout,
  updatePassword,
  checkToken
}
