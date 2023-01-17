import Campaign from "./campaign.model.js";
import path from "path";
import {IMAGES_CAMPAIGN_DIRECTORY} from "./campaign.types.js";
import storagePath from "../utils/storagePath.js";

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
        title, collected_target, deadline, image: getFullUriImage(image), slug, description, user_id
    })
    return generateResponse(campaign)
}

const generateResponse = (campaign) => {
    return {
        title: campaign.title,
        collected_target: campaign.collected_target,
        deadline: campaign.deadline,
        image: campaign.image,
        slug: campaign.slug,
        description: campaign.description,
        created_at: campaign.created_at
    }
}

const campaignService = Object.freeze({
    createCampaign
})

export default campaignService