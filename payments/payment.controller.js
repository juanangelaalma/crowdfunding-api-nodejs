import paymentService from "./payment.service.js";
import errorHandler, {HttpError} from "../error_handlers/index.js";
import donationService from "../donations/donation.service.js";
import crypto from "crypto"

const createPaymentDonation = async (newDonation) => {
    try {
        if(newDonation.payment_type === "bank_transfer") {
            const midtransResponse = await paymentService.createBankPayment(newDonation)
            return midtransResponse
        } else if (newDonation.payment_type === "emoney") {
            const midtransResponse = await paymentService.createEmoneyPayment(newDonation)
            return midtransResponse
        } else if (newDonation.payment_type === "cod") {
            const midtransResponse = await paymentService.createCodPayment(newDonation)
            return midtransResponse
        } else {
            throw new HttpError(400, "Payment type not found")
        }
    } catch (error) {
        throw error
    }
}

const generateHash = (order_id, status_code, gross_amount) => {
    const hash = crypto.createHash("sha512")
    const signatureKey = order_id + status_code + gross_amount + process.env.MIDTRANS_SERVER_KEY
    hash.update(signatureKey)
    const signature = hash.digest("hex")
    return signature
}

const midtransCallback = async (req, res) => {
    const {transaction_status, order_id, signature_key, status_code, gross_amount} = req.body

    const statuses = {
        "settlement": "success",
        "capture": "success",
        "deny": "failed",
        "cancel": "failed",
        "expire": "failed",
        "pending": "pending"
    }

    try {
        if(!(generateHash(order_id, status_code, gross_amount) === signature_key)) {
            throw new HttpError(400, "Invalid signature")
        }
        const donation = await donationService.updateDonationByInvoice(order_id, statuses[transaction_status])
        res.send(donation).status(201)
    } catch (error) {
        errorHandler(error, req, res)
    }
}

const paymentController = Object.freeze({
    createPaymentDonation,
    midtransCallback
})

export default paymentController