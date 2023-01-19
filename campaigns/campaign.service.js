import Campaign from "./campaign.model.js";
import path from "path";
import {IMAGES_CAMPAIGN_DIRECTORY} from "./campaign.types.js";
import storagePath from "../utils/storagePath.js";
import mongoose from "mongoose";
import errorHandler, {HttpError} from "../error_handlers/index.js";

const addDaysToCurrentDate = (days) => {
    const currentDate = new Date()
    return currentDate.setDate(currentDate.getDate() + days)
}

const getFullUriImage = (image) => {
    const baseUrl = process.env.APP_BASE_URL
    const imageDirectory = path.relative('.', storagePath(IMAGES_CAMPAIGN_DIRECTORY))
    return `${baseUrl}/${imageDirectory}/${image.filename}`
}

const createCampaign = async ({ title, collected_target, duration, image, slug, description, user_id }) => {
    const deadline = addDaysToCurrentDate(duration)
    const campaign = await Campaign.create({
        title, collected_target, deadline, image: getFullUriImage(image), slug, description, user: user_id
    })
    return generateResponse(campaign)
}

const getAllCampaigns = async () => {
    const campaigns = await Campaign.find({}).populate({
        path: 'user',
        select: '_id name email'
    }).sort({created_at: -1})
    return campaigns.map(campaign => generateResponse(campaign))
}

const getCampaignById = async (campaignId) => {
    try {
        const campaign = await Campaign.findById(campaignId)
        if (!campaign) {
            throw new HttpError(404, 'Campaign not found')
        }
        return generateResponse(campaign)
    } catch (error) {
        if(error instanceof mongoose.Error.CastError) {
            throw new HttpError(400, 'Invalid campaign id')
        }
        if(error instanceof HttpError) {
            throw error
        }
        throw new HttpError(500, 'Internal server error')
    }
}

const deleteCampaign = async (campaignId) => {
    try {
        const campaign = await Campaign.findByIdAndDelete(campaignId)
        if (!campaign) {
            throw new HttpError(404, 'Campaign not found')
        }
        return generateResponse(campaign)
    } catch (error) {
        if(error instanceof mongoose.Error.CastError) {
            throw new HttpError(400, 'Invalid campaign id')
        }
        if(error instanceof HttpError) {
            throw error
        }
        throw new HttpError(500, 'Internal server error')
    }
}

const generateResponse = (campaign) => {
    return {
        _id: campaign._id,
        title: campaign.title,
        collected_target: campaign.collected_target,
        deadline: campaign.deadline,
        image: campaign.image,
        slug: campaign.slug,
        description: campaign.description,
        created_at: campaign.created_at,
        user: campaign.user
    }
}

const campaignService = Object.freeze({
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    deleteCampaign
})

export default campaignService