import errorHandler from "../error_handlers/index.js";
import {decodeToken} from "../users/user.middleware.js";
import userServices from "../users/user.service.js";
import donationServices from "./donation.service.js";
import donationValidation from "./donation.validation.js";

const createDonation = async (req, res, next) => {
    try {
        const validation = await donationValidation.validateCreateDonation(req.body);

        const user = decodeToken(req)
        let userData = null
        const newDonation = { ...req.body, user_id: user._id }

        if(!newDonation.name) {
            userData = await userServices.getUser(user.id)
            newDonation.name = userData.name
        }

        if(!newDonation.email) {
            if(!userData) userData = await userServices.getUser(user.id)
            newDonation.email = userData.email
        }

        const donation = await donationServices.createDonation(newDonation)

        res.status(201).json({ data: donation, message: 'create donation successfully' })
    } catch (error) {
        errorHandler(error, req, res)
    }
}

const donationController = {
    createDonation
}

export default donationController