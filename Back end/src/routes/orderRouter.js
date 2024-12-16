const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')

router.post('/createCart', orderController.createCart)
router.post('/createOrder', orderController.createOrder)
router.patch('/update/:orderid', orderController.updateOrder)
router.get('/getCart/:userid', orderController.getCart)
router.get('/getListAll', orderController.getAll )
router.get('/getOrderById/:userid', orderController.getByID )
router.get('/getOrderByDate/:date', orderController.getOrderByDate )
router.get('/getOrderByStatus/:status', orderController.getOrderByStatus )
module.exports = router