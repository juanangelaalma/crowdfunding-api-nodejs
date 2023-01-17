import express from 'express'
import campaignStorages from './campaign.storage.js'
import campaignController from "./campaign.controller.js";
import userMiddlewares from "../users/user.middleware.js";

const router = express.Router()

router.get('/', (req, res) => {
    res.send('get all campaigns')
})

router.get('/:campaignId', (req, res) => {
    res.send(`get campaigns by id ${req.params.campaignId}`)
})

router.post('/', (req, res, next) => {
    console.log('accessed')
    next()
} , userMiddlewares.verifyToken, campaignStorages.imageUpload, campaignController.createCampaign)

router.put('/:campaignId', (req, res) => {
    res.send('update campaign')
})

router.delete('/:campaignId', (req, res) => {
    res.send('delete campaign')
})

export default router