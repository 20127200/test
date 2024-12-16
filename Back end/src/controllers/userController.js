const userService = require('../services/userService')

const createUser = async (req,res)=>{
    try{
        const response = await userService.createUser(req.body)
        return res.status(200).json(response)
    }catch (e){
        return res.status(404).json({e})
    }
}

const loginUser = async (req,res)=>{
    try{
        const response = await userService.loginUser(req.body)
        return res.status(200).json(response)
    }catch (e){
        return res.status(404).json({e})
    }
}

const getAllUser = async (req,res)=>{
    try{
        const response = await userService.getAllUser()
        return res.status(200).json(response)
    }catch (e){
        return res.status(404).json({e})
    }
}

module.exports = {
    createUser,loginUser,getAllUser
}