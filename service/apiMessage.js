const apiMessage = {
  FAIL: {
    message: '失敗',
    statusCode: 400
  },
  SUCCESS: {
    message: '成功',
    statusCode: 200
  },
  FIELD_FAILED: {
    message: '請確認資料欄位 或 路由參數 錯誤',
    statusCode: 400
  },
  DATA_NOT_FOUND: {
    message: '請確認資料是否存在，找不到對應的 ＩＤ 和 資料',
    statusCode: 400
  },
  LOGIN_FAILED: {
    message: '登入失敗',
    statusCode: 401
  },
  TOKEN_FAILED: {
    message: '請確認token是否 過期 或 錯誤',
    statusCode: 401
  },
  ROUTER_NOT_FOUND: {
    message: '找不到路由',
    statusCode: 404
  },
  INTERNAL_SERVER_ERROR: {
    message: '發生錯誤，請稍後再試',
    statusCode: 500
  }
}

module.exports = apiMessage
