const express = require('express')
const router = express.Router()
const chkLogin = require('../middleware/chkLogin')
const controller = require('../controllers/machine')

router.get('/', chkLogin, controller.getMachine)
router.get('/nealyoutofstock', chkLogin, controller.getMachineItemNearlyOutOfStock)
router.post('/', chkLogin, controller.addMachine)
router.patch('/', chkLogin, controller.updateMachineInfo)
router.delete('/:machineId', chkLogin, controller.deleteMachine)
router.get('/item/:machineId', chkLogin, controller.getMachineItem)
router.post('/item/:machineId', chkLogin, controller.manageMachineItem)
router.delete('/item/:machineId/:slotId', chkLogin, controller.deleteMachineItem)

router.get('/item/:machineId/client', controller.getMachineItemClient)


module.exports = router
