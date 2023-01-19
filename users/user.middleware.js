import jwt from 'jsonwebtoken'
import errorHandler, { HttpError } from "../error_handlers/index.js";
import userServices from "./user.service.js";

const getTokenFromHeaders = (req) => {
    // get token from the headers
    return req.headers['x-access-token'] || req.headers.authorization;
}

const decodeToken = (req) => {
    const token = getTokenFromHeaders(req)
    // verify the token, will contain id of user
    return token ? jwt.verify(token, process.env.JWT_SECRET) : null
}

const verifyToken = (req, res, next) => {
    try {
        const user = decodeToken(req)
        if(!user) {
            errorHandler(new HttpError(401, "Access denied. No token provided."), req, res)
        }
        req.user = user
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            error = new HttpError(401, "Token expired.")
        }
        errorHandler(error, req, res)
    }
}

const equalsRole = (user, expectedRole) => {
    if(!user || user.role !== expectedRole) {
        throw new HttpError(403, "Forbidden")
    }
    return true
}

const verifyAdmin = async (req, res, next) => {
    if (!req.user) {
        req.user = decodeToken(req, res, next)
    } else {
        try {
            const user = await userServices.getUser(req.user.id)
            equalsRole(user, 'admin')
            next()
        } catch (error) {
            errorHandler(error, req, res)
        }
    }
}

const userMiddlewares = Object.freeze({
    verifyToken, verifyAdmin
})

export default userMiddlewares
export { verifyToken, verifyAdmin, getTokenFromHeaders, decodeToken }