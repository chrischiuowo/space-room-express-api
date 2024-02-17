const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)

const connectDB = () => {
  mongoose
    .connect(DB)
    .then(() => {
      console.log('資料庫連線成功')
      return true
    })
    .catch(() => {
      console.log('資料庫連線失敗')
      return false
    })
}

module.exports = connectDB
