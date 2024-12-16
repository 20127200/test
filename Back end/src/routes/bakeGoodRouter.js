const express = require('express')
const router = express.Router()
const bakeGoodController = require('../controllers/bakeGoodController')

router.post('/create', bakeGoodController.createBakeGood)
router.get('/search/:key', bakeGoodController.searchBakeGood)
router.get('/listAll', bakeGoodController.getAllBakeGood)
router.get('/filter/:cate', bakeGoodController.filterCateBakeGood)
router.get('/getDetail/:id', bakeGoodController.getDetail)
module.exports = router