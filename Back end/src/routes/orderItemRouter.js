const express = require('express')
const router = express.Router()
const orderItemController = require('../controllers/orderItemController')

router.post('/addItem', orderItemController.addItem)
router.patch('/update/:orderItemId', orderItemController.updateItem)
router.get('/getListItem/:orderid', orderItemController.getListItem)
router.delete('/delete/:orderItemId', orderItemController.deteleItem)
module.exports = router