import errorHandler, {HttpError} from "../error_handlers/index.js";
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

const getAllCampaigns = async (req, res) => {
    const campaigns = await campaignService.getAllCampaigns()
    res.status(200).send({ data: campaigns, message: 'Retrieve campaigns successfully' })
}

const getCampaignById = async (req, res) => {
    try {
        const campaign = await campaignService.getCampaignById(req.params.campaignId)
        res.status(200).send({ data: campaign, message: 'Retrieve campaign successfully' })
    } catch (error) {
        errorHandler(error, req, res)
    }
}

const campaignController = Object.freeze({
    createCampaign,
    getAllCampaigns,
    getCampaignById
})

export default campaignController
export { createCampaign, getAllCampaigns }