import campaignValidation from "./campaign.validation.js";
import errorHandler from "../error_handlers/index.js";

const validationIfFileTypeNotSupported = (req, res, next) => {

}

const validationCreate = (req, res, next) =>  {
    try {
        const newCampaign = { ...req.body, image: req.file, user_id: req.user }
        campaignValidation.validateCampaignCreate(newCampaign)
        next()
    } catch (error) {
        errorHandler(error, req, res)
    }
}

const campaignMiddlewares = Object.freeze({
    validationCreate
})

export default campaignMiddlewares
export { validationCreate }

