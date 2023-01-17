import Joi from 'joi'
import {HttpError} from "../error_handlers/index.js";

const campaignValidateSchema = Joi.object().keys({
    title: Joi.string().required(),
    collected_target: Joi.number().required(),
    duration: Joi.number().required(),
    image: Joi.object().required(),
    slug: Joi.string(),
    description: Joi.string(),
    user_id: Joi.allow()
})

const validateCampaignCreate = (campaignData) => {
    const { fileValidationError, ...campaignDataToValidate } = campaignData
    if(fileValidationError) {
        throw new HttpError(400, fileValidationError)
    }
    const { error, value } = campaignValidateSchema.validate(campaignDataToValidate)
    if (error) {
        throw new HttpError(400, error.message)
    }
    return value
}

const campaignValidation = Object.freeze({
    validateCampaignCreate
})

export default campaignValidation
export { validateCampaignCreate }