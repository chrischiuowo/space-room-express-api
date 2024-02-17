const mongoose = require('mongoose')
const { Schema, model } = mongoose

const commentSchema = new Schema(
  {
    content: {
      type: String,
      require: [true, '留言內容 為必填']
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: {
      currentTime: () => Date.now()
    }
  }
)

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: '_id name avatar'
  })
  this.populate({
    path: 'commentReplies'
  })
  next()
})

commentSchema.virtual('commentReplies', {
  ref: 'CommentReply',
  foreignField: 'comment',
  localField: '_id'
})

const Comment = model('Comment', commentSchema)

module.exports = Comment
