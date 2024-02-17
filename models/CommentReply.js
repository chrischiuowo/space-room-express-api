const mongoose = require('mongoose')
const { Schema, model } = mongoose

const commentReplySchema = new Schema(
  {
    content: {
      type: String,
      require: [true, '留言回覆內容 為必填']
    },
    comment: {
      type: mongoose.Schema.ObjectId,
      required: [true, '留言ID 為必填'],
      ref: 'Comment'
    },
    post: {
      type: mongoose.Schema.ObjectId,
      required: [true, '貼文ID 為必填'],
      ref: 'Post'
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, '使用者ID 為必填'],
      ref: 'User'
    },
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

commentReplySchema.pre(/^find/, function (next) {
  this.sort('-createdAt')
  this.populate({
    path: 'user',
    select: '_id name avatar'
  })

  next()
})

const CommentReply = model('CommentReply', commentReplySchema)

module.exports = CommentReply
