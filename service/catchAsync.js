// 代替 try catch 語法
const catchAsync = (fn) => (req, res, next) => {
  // eslint-disable-next-line promise/no-callback-in-promise
  fn(req, res, next).catch(next)
}

module.exports = catchAsync
