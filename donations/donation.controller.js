import errorHandler from "../error_handlers/index.js";
import {decodeToken} from "../users/user.middleware.js";
import userServices from "../users/user.service.js";
import donationServices from "./donation.service.js";
import donationValidation from "./donation.validation.js";
import {HttpError} from "../error_handlers/index.js";

const createDonation = async (req, res, next) => {
    try {
        await donationValidation.validateCreateDonation(req.body);
        await donationValidation.ifNoTokenNameAndEmailIsRequired(req);

        const user = decodeToken(req)

        let userData = null
        const newDonation = { ...req.body, user_id: user ? user.id : null }

        if(!newDonation.name) {
            userData = await userServices.getUser(user.id)
            newDonation.name = userData.name
        }

        if(!newDonation.email) {
            if(!userData) userData = await userServices.getUser(user.id)
            newDonation.email = userData.email
        }

        const donation = await donationServices.createDonation({ ...newDonation })

        res.status(201).json({ data: donation, message: 'create donation successfully' })
    } catch (error) {
        console.log(error)
        errorHandler(error, req, res)
    }
}

const donationController = Object.freeze({
    createDonation
})

export default donationController