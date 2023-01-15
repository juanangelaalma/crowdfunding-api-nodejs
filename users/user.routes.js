import express from 'express'
import userController from "./user.controller.js"
import userMiddlewares from "./user.middleware.js";

const router = express.Router()

router.get('/', userMiddlewares.verifyToken, userMiddlewares.verifyAdmin, userController.getUsers)
router.get('/:userId', userMiddlewares.verifyToken, userMiddlewares.verifyAdmin, userController.getUser)
router.post('/', userController.createUser)
router.post('/login', userController.login)
router.put('/:userId', userMiddlewares.verifyToken, userMiddlewares.verifyAdmin, userController.updateUser)
router.delete('/:userId', userMiddlewares.verifyToken, userMiddlewares.verifyAdmin, userController.deleteUser)

export default router