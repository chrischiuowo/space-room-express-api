const appError = (apiMessage, next) => {
  const error = new Error(apiMessage.message)
  error.statusCode = apiMessage.statusCode
  error.isOperational = true
  next(error)
}

module.exports = appError
