import errorHandler, {HttpError} from "../error_handlers/index.js";
import campaignService from "./campaign.service.js"
import campaignValidation from "./campaign.validation.js";

const createCampaign = async (req, res) => {
    try {
        const requests = { ...req.body, image: req.file, user_id: req.user.id, fileValidationError: req.fileValidationError }
        const newCampaign = campaignValidation.validateCampaignCreate(requests)
        const campaign = await campaignService.createCampaign(newCampaign)
        const campaignWithHATEOAS = generateHATEOASLinks(campaign)
        res.status(201).send({ data: campaignWithHATEOAS, message: 'Campaign is created' })
    } catch (error) {
        errorHandler(error, req, res)
    }
}

const getAllCampaigns = async (req, res) => {
    const campaigns = await campaignService.getAllCampaigns()
    const campaignsWithHATEOAS = campaigns.map(campaign => generateHATEOASLinks(campaign))
    res.status(200).send({ data: campaignsWithHATEOAS, message: 'Retrieve campaigns successfully' })
}

const getCampaignById = async (req, res) => {
    try {
        const campaign = await campaignService.getCampaignById(req.params.campaignId)
        const campaignWithHATEOAS = generateHATEOASLinks(campaign)
        res.status(200).send({ data: campaignWithHATEOAS, message: 'Retrieve campaign successfully' })
    } catch (error) {
        errorHandler(error, req, res)
    }
}

const deleteCampaign = async (req, res) => {
    try {
        const campaign = await campaignService.deleteCampaign(req.params.campaignId)
        res.status(200).send({ data: campaign, message: 'Campaign is deleted' })
    } catch (error) {
        errorHandler(error, req, res)
    }
}

const getCampaignComments = async (req, res) => {
    try {
        const comments = await campaignService.getCampaignComments(req.params.campaignId)
        res.status(200).send({ data: comments, message: 'Retrieve comments successfully' })
    } catch (error) {
        errorHandler(error, req, res)
    }
}

const getCampaignDonors = async (req, res) => {
    try {
        const donors = await campaignService.getCampaignDonors(req.params.campaignId)
        res.status(200).send({ data: donors, message: 'Retrieve donors successfully' })
    } catch (error) {
        errorHandler(error, req, res)
    }
}

const generateHATEOASLinks = (campaign) => {
    const _links = {
        self: `/campaigns/${campaign._id}`,
        comments: `/campaigns/${campaign._id}/comments`,
        donors: `/campaigns/${campaign._id}/donors`,
    }
    return { ...campaign, _links }
}

const campaignController = Object.freeze({
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    deleteCampaign,
    getCampaignComments,
    getCampaignDonors
})

export default campaignController
export { createCampaign, getAllCampaigns }