const mongoose = require('mongoose')
const { Schema, model } = mongoose

const postSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, '使用者ID 為必填']
    },
    content: {
      type: String,
      required: [true, '貼文內容 為必填']
    },
    images: {
      type: Array,
      default: []
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: {
      currentTime: () => Date.now()
    }
  }
)

postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id'
})

const Post = model('Post', postSchema)

module.exports = Post
