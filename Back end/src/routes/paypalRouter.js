const express = require('express')
const router = express.Router()
const paypalController = require('../controllers/paypalController')

router.post('/createPayPalOrder', paypalController.createPayPalOrder)
router.post('/capturePayPalOrder', paypalController.capturePayPalOrder)

module.exports = router