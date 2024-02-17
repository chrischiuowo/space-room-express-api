const express = require('express')
const router = express.Router()
const uploadController = require('../controllers/upload')
const { checkUpload } = require('../middlewares/upload')
const { isAuth } = require('../middlewares/auth')

router.post('/upload', isAuth, checkUpload, uploadController.postImages)

router.delete('/delete_upload/:hash', isAuth, uploadController.deleteImage)

module.exports = router
