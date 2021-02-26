const express = require('express')
const router = express.Router()
const controller = require('../controllers/transaction')
const chkLogin = require('../middleware/chkLogin')

router.get('/', chkLogin, controller.getTransaction)
router.post('/:machineId/:itemId', controller.createTransaction)
router.get('/transactiondetail/:transactionNumber', controller.getTransactionDetail)
router.get('/exec/:transactionNumber', controller.execTransaction)
router.patch('/cancel/:transactionNumber', controller.cancelTransaction)

module.exports = router
