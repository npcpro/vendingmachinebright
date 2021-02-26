const express = require('express')
const router = express.Router()
const chkLogin = require('../middleware/chkLogin')
const controller = require('../controllers/item')
const storage = require('../controllers/upload-config')
const multer = require('multer');
const upload = multer(storage)


router.get('/', chkLogin, controller.getItem)
router.get('/list', chkLogin, controller.getItemList)
router.post('/', upload.single('image'), chkLogin, controller.addItem)
router.patch('/', upload.single('image'), chkLogin, controller.updateItem)
router.delete('/:itemId', chkLogin, controller.deleteItem)


module.exports = router
