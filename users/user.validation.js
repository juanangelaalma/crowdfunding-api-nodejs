import Joi from 'joi';
import {HttpError} from "../error_handlers/index.js";

const userValidateSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(25),
    role: Joi.string().required().valid('admin', 'user')
})

const loginDataValidateSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6).max(25)
})

const userValidateUpdateSchema = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().email().required()
})

const validateUserPost = (userData) => {
    const { error, value } = userValidateSchema.validate(userData)
    if (error) {
        throw new HttpError(400, error.message)
    }
    return value
}

const validateDataLogin = (loginData) => {
    const { error, value } = loginDataValidateSchema.validate(loginData)
    if (error) {
        throw new HttpError(400, error.message)
    }
    return value
}

const validateUserUpdate = (updateData) => {
    const { error, value } = userValidateUpdateSchema.validate(updateData)
    if (error) {
        throw new HttpError(400, error.message)
    }
    return value
}

const userValidation = Object.freeze({
    validateUserPost, validateDataLogin, validateUserUpdate
})

export default userValidation
export { validateUserPost, validateDataLogin, validateUserUpdate }

