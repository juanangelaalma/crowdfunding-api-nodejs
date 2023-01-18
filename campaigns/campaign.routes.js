import express from 'express'
import campaignStorages from './campaign.storage.js'
import campaignController from "./campaign.controller.js";
import userMiddlewares from "../users/user.middleware.js";

const router = express.Router()

router.get('/', campaignController.getAllCampaigns)

router.get('/:campaignId', campaignController.getCampaignById)

router.post('/', userMiddlewares.verifyToken, campaignStorages.imageUpload, campaignController.createCampaign)

router.put('/:campaignId', (req, res) => {
    res.send('update campaign')
})

router.delete('/:campaignId', userMiddlewares.verifyToken, userMiddlewares.verifyAdmin, campaignController.deleteCampaign)

export default router