import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from './user.model.js'
import { HttpError } from "../error_handlers/index.js";
import mongoose from "mongoose";

const getUsers = async () => {
    const users = await User.find({})
    return users.map(user => generateResponse(user))
}

const getUser = async (userId) => {
    const user = await User.findById(userId)
    return generateResponse(user)
}

const createUser = async (userData) => {
    const { name, email, password, role } = userData
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ name, email, password: hashedPassword, role })
    await newUser.save()
    return generateResponse(newUser)
}

const login = async (email, password) => {
    const user = await User.findOne({ email })
    if(!user) {
        throw new HttpError(401, "Invalid login credentials")
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid) {
        throw new HttpError(401, "Invalid login credentials")
    }
    return generateResponse(user)
}

const updateUser = async (userId, updates) => {
    try {
        const user = await User.findByIdAndUpdate(userId, updates, { new: true })
        return generateResponse(user)
    } catch (error) {
        if(error instanceof mongoose.Error.CastError) {
            throw new HttpError(404, "User not found")
        }
    }
}

const deleteUser = async (userId) => {
    try {
        const user = await User.findByIdAndDelete(userId)
        return generateResponse(user)
    } catch (error) {
        if(error instanceof mongoose.Error.CastError) {
            throw new HttpError(404, "User not found")
        }
    }
}

const generateResponse = (user) => {
    return user ? {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    } : {}
}

const userServices = Object.freeze({
    getUser,
    getUsers,
    createUser,
    login,
    updateUser,
    deleteUser
})

export default userServices
export { getUser, getUsers, createUser, login, updateUser }