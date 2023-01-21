import Joi from 'joi'
import {HttpError} from "../error_handlers/index.js";
import campaignServices from "../campaigns/campaign.service.js";

const createDonationSchema = Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    amount: Joi.number().required(),
    comment: Joi.string(),
    is_anonymous: Joi.boolean().required(),
    payment_type: Joi.string().required().valid('emoney', 'bank_transfer', 'cod'),
    entity_payment_name: Joi.string().required().valid('bca', 'bri', 'echannel', 'permata'),
    campaign_id: Joi.string().required(),
})

const campaignMustExist = async (campaignId) => {
    const campaign = await campaignServices.getCampaignById(campaignId)
    console.log(campaign)
    if(!campaign) {
        throw new HttpError(404, 'Campaign not found')
    }
    return campaign
}

const validateCreateDonation = (donationData) => {
    const { error, value } = createDonationSchema.validate(donationData)
    if(error) {
        throw new HttpError(400, error.message)
    }
    return value
}

const donationValidation = Object.freeze({
    validateCreateDonation,
    campaignMustExist
})

export default donationValidation