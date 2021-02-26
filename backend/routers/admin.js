const express = require('express')
const router = express.Router()
const chkLogin = require('../middleware/chkLogin')
const controller = require('../controllers/admin')

router.post('/login', controller.login)
router.post('/logout', chkLogin, controller.logout)
router.post('/chkLogin', controller.chkLogin)




module.exports = router
