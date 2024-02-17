const mongoose = require('mongoose')
const { Schema, model } = mongoose
const validator = require('validator')

const userSchema = new Schema(
  {
    // 暱稱
    name: {
      type: String,
      required: [true, '暱稱 為必填'],
      minlength: 2
    },
    // Email
    email: {
      type: String,
      required: [true, 'Email 為必填'],
      unique: true,
      validate: [validator.isEmail, 'Email 格式錯誤']
    },
    // 密碼 Never Show to user
    password: {
      type: String,
      required: [true, '密碼 為必填'],
      min: [8, '密碼 至少 8 碼以上'],
      trim: true,
      select: false
    },
    // 大頭照 驗證解析度寬度至少 300、圖片寬高比 1:1
    avatar: {
      type: Object,
      required: false,
      default: {
        link: null,
        hash: null
      }
    },
    // 追蹤名單
    followings: [
      {
        _id: false,
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        },
        createdAt: {
          type: Number
        }
      }
    ],
    // 被追蹤名單
    followers: [
      {
        _id: false,
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        },
        createdAt: {
          type: Number
        }
      }
    ],
    createdAt: {
      type: Number
    },
    updatedAt: {
      type: Number
    }
  },
  {
    versionKey: false,
    timestamps: {
      currentTime: () => Date.now()
    }
  }
)

const User = model('User', userSchema)

module.exports = User
