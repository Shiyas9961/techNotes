const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

//@desc Get all users
//@routes GET /users
//@access Private
const getAllUsers = asyncHandler( async (req, res) => {
    const users = await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({message : "Users Not found !"})
    }
    res.json(users)
}) 

//@desc Post New user
//@route POST /users
//@access Private
const createNewUser = asyncHandler( async (req, res) => {
    const { username, password, roles } = req.body

    if(!username || !password){
        return res.status(400).json({message : "All fields are required !"})
    }
    const duplicate = await User.findOne({username}).collation({ locale : 'en', strength : 2 }).lean().exec()
    if(duplicate){
        return res.status(409).json({message : "Duplicate Username"})
    }
    //Password hashing
    const hashedPwd = await bcrypt.hash(password,10) //salt

    const userDetailsObj = (!Array.isArray(roles) || !roles.length) ? { username, "password" : hashedPwd } : { username,"password" : hashedPwd, roles }


    const user = await User.create(userDetailsObj)
    if(user){
        res.status(201).json({message : `New User ${username} Created`})
    }else{
        res.status(400).json({message : 'Invalid User data recieved !'})
    }
})

//@desc Update user
//@route PATCH /users
//@access Private
const updateExistingUser = asyncHandler( async (req, res) => {
    const { id, username, password, roles, active} = req.body

    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean'){
        return res.status(400).json({message : 'All fields required !'})
    }
    const user = await User.findById(id).exec()
    if(!user){
        return res.status(400).json({message : 'User not found !'})
    }
    const dupliacate = await User.findOne({username}).collation({ locale : 'en', strength : 2 }).lean().exec()

    if(dupliacate && dupliacate?._id.toString() !== id){
        return res.status(400).json({message : 'Duplicate Username'})
    }
    user.username = username
    user.active = active
    user.roles = roles

    if(password){
        //Hashing password
        user.password = await bcrypt.hash(password,10)
    }
    const updatedUser = await user.save()

    res.json({message : `${updatedUser.username} Updated`})
})

//@desc Delete user
//@route DELETE /users
//@accss Private
const deleteExistingUser = asyncHandler( async (req, res) => {
    const { id } = req.body

    if(!id){
        return res.status(400).json({message : 'User ID is Required !'})
    }
    const note = await Note.findOne({user : id}).lean().exec()
    if(note){
        return res.status(400).json({message : 'User has assigned notes !'})
    }
    const user = await User.findById(id).exec()
    if(!user){
        res.status(400).json({message : 'User not found !'})
    }
    const result = await user.deleteOne()

    const reply = `Username ${result.username} with ID ${result._id} has deleted`

    res.json(reply)
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateExistingUser,
    deleteExistingUser
}