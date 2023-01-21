import BankTransfer from "./class/BankTransfer.js";
import paymentService from "./payment.service.js";
import {HttpError} from "../error_handlers/index.js";

const createPaymentDonation = async (newDonation) => {
    console.log(newDonation)
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

const paymentController = Object.freeze({
    createPaymentDonation
})

export default paymentController