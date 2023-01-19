import jwt from 'jsonwebtoken'

import userServices from "./user.service.js";
import userValidation from "./user.validation.js";
import errorHandler from "../error_handlers/index.js";

const getUsers = async (req, res, next) => {
    try {
        const users = await userServices.getUsers()
        res.status(200).send({ data: users, message: 'Users retrieved successfully' })
    } catch (error) {
        console.log(error.status)
        errorHandler(error, req, res)
    }
}

// Di controller terdapat application logic seperti validasi data request dan mengirimkan ke service
const createUser = async (req, res, next) => {
    try {
        const userDataAfterValidation = userValidation.validateUserPost(req.body)
        const newUser = await userServices.createUser(userDataAfterValidation)
        res.status(201).send({ data: newUser, message: 'User created' })
    } catch (error) {
        errorHandler(error, req, res)
    }
}

const getUser = async (req, res, next) => {
    try {
        const user = await userServices.getUser(req.params.userId);
        res.status(200).send({ data: user, message: 'User retrieved successfully' })
    } catch (error) {
        errorHandler(error, req, res)
    }
}

const login = async (req, res, next) => {
    try {
        const loginDataAfterValidation = userValidation.validateDataLogin(req.body)
        const user = await userServices.login(loginDataAfterValidation.email, loginDataAfterValidation.password)
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.status(201).send({ ...user, token })
    } catch (error) {
        errorHandler(error, req, res)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const userDataAfterValidation = userValidation.validateUserUpdate(req.body)
        const userAfterUpdated = await userServices.updateUser(req.params.userId, req.body)
        res.status(201).send({ data: userAfterUpdated, message: "User updated successfully" })
    } catch (error) {
        errorHandler(error, req, res)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const user = await userServices.deleteUser(req.params.userId)
        res.status(201).send({ data: user, message: "User deleted successfully" })
    } catch (error) {
        errorHandler(error, req, res)
    }
}

const userController = Object.freeze({
    getUsers,
    getUser,
    createUser,
    login,
    updateUser,
    deleteUser
})

export default userController
export { getUsers, getUser, createUser, login, updateUser, deleteUser }