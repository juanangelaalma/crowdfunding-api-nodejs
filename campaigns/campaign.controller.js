import errorHandler from "../error_handlers/index.js";
import campaignService from "./campaign.service.js"
import campaignValidation from "./campaign.validation.js";

const createCampaign = async (req, res) => {
    try {
        const requests = { ...req.body, image: req.file, user_id: req.user.id, fileValidationError: req.fileValidationError }
        const newCampaign = campaignValidation.validateCampaignCreate(requests)
        const campaign = await campaignService.createCampaign(newCampaign)
        res.status(201).send({ data: campaign, message: 'Campaign is created' })
    } catch (error) {
        errorHandler(error, req, res)
    }
}

const campaignController = Object.freeze({
    createCampaign
})

export default campaignController
export { createCampaign }