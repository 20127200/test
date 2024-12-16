const bakeGoodService = require('../services/bakeGoodService')

const createBakeGood = async (req,res)=>{
    try{
        const response = await bakeGoodService.createBakeGood(req.body)
        return res.status(200).json(response)
    }catch (e){
        return res.status(404).json({e})
    }
}

const searchBakeGood = async (req,res)=>{
    try{
        const key = req.params.key;

        const response = await bakeGoodService.searchBakeGood(key)
        return res.status(200).json(response)
    }catch (e){
        return res.status(404).json({e})
    }
}

const getAllBakeGood = async (req,res)=>{
    try{
        const response = await bakeGoodService.getAllBakeGood()
        return res.status(200).json(response)
    }catch (e){
        return res.status(404).json({e})
    }
}

const filterCateBakeGood = async (req,res)=>{
    try{
        const category = req.params.cate;

        const response = await bakeGoodService.filterCateBakeGood(category)
        return res.status(200).json(response)
    }catch (e){
        return res.status(404).json({e})
    }
}
const getDetail = async (req,res)=>{
    try{
        const id = req.params.id;

        const response = await bakeGoodService.getDetail(id)
        return res.status(200).json(response)
    }catch (e){
        return res.status(404).json({e})
    }
}
module.exports = {
    createBakeGood,searchBakeGood,getAllBakeGood,filterCateBakeGood,getDetail
}