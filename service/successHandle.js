const successHandle = ({ res, message, data }) => {
  res
    .send({
      status: true,
      message,
      data
    })
    .end()
}

module.exports = successHandle
