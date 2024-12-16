const paypalService = require('../services/paypalService')

const createPayPalOrder = async (req,res)=>{
    try{
        const response = await paypalService.createPayPalOrder(req.body)
        return res.status(200).json(response)
    }catch (e){
        return res.status(404).json({e})
    }
}

const capturePayPalOrder = async (req,res)=>{
    try{
        const response = await paypalService.capturePayPalOrder(req.body)
        return res.status(200).json(response)
    }catch (e){
        return res.status(404).json({e})
    }
}

module.exports = {
    createPayPalOrder,capturePayPalOrder
}
