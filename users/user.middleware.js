import jwt from 'jsonwebtoken'
import errorHandler, { HttpError } from "../error_handlers/index.js";
import userServices from "./user.service.js";

const getTokenFromHeaders = (req) => {
    // get token from the headers
    const token = req.headers['x-access-token'] || req.headers.authorization;

    if(!token) {
        throw new HttpError(401, "Access denied. No token provided.")
    }

    return token
}

const decodeToken = (req, res, next) => {
    try {
        const token = getTokenFromHeaders(req)
        // verify the token, will contain id of user
        return jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            error = new HttpError(401, "Token expired.")
        }
        errorHandler(error, req, res)
    }
}

const verifyToken = (req, res, next) => {
    console.log("verifyToken")
    req.user = decodeToken(req, res, next)
    if(req.user) {
        next()
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
export { verifyToken, verifyAdmin }