import Joi from 'joi'
import {HttpError} from "../error_handlers/index.js";

const createDonationSchema = Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email(),
    amount: Joi.number().required(),
    comment: Joi.string(),
    is_anonymous: Joi.boolean().required(),
    payment_type: Joi.string().required().valid('wallet', 'bank', 'cod'),
    entity_payment_name: Joi.string().required(),
    campaign_id: Joi.string().required(),
})

const validateCreateDonation = (donationData) => {
    const { error, value } = createDonationSchema.validate(donationData)
    if(error) {
        throw new HttpError(400, error.message)
    }
    return value
}

const donationValidation = Object.freeze({
    validateCreateDonation
})

export default donationValidation