const orderItemService = require('../services/orderItemService')

const addItem = async (req,res)=>{
    try{
        
        const response = await orderItemService.create(req.body)
        return res.status(200).json(response)
    }catch (e){
        return res.status(404).json({e})
    }
}

const updateItem = async (req,res)=>{
    try{
        const orderItemId = req.params.orderItemId;
        const response = await orderItemService.update(orderItemId,req.body)
        return res.status(200).json(response)
    }catch (e){
        return res.status(404).json({e})
    }
}

const getListItem = async (req,res)=>{
    try{
        const orderid = req.params.orderid;
        const response = await orderItemService.getListItem(orderid)
        return res.status(200).json(response)
    }catch (e){
        return res.status(404).json({e})
    }
}

const deteleItem = async (req,res)=>{
    try{
        const orderItemId = req.params.orderItemId;
        const response = await orderItemService.deleteItem(orderItemId)
        return res.status(200).json(response)
    }catch (e){
        return res.status(404).json({e})
    }
}
module.exports = {
    addItem,updateItem,getListItem,deteleItem
}