import Joi from 'joi'
import {HttpError} from "../error_handlers/index.js";
import campaignServices from "../campaigns/campaign.service.js";
import {  getTokenFromHeaders } from "../users/user.middleware.js";

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

const ifNoTokenNameAndEmailIsRequired = async (req) => {
    const token = getTokenFromHeaders(req)
    if(!token) {
        const { name, email } = req.body
        if(!name) {
            throw new HttpError(400, 'Name is required')
        }
        if(!email) {
            throw new HttpError(400, 'Email is required')
        }
    }
}

const donationValidation = Object.freeze({
    validateCreateDonation,
    campaignMustExist,
    ifNoTokenNameAndEmailIsRequired
})

export default donationValidation