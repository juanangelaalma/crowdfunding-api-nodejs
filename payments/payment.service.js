import BankTransfer from "./class/BankTransfer.js";
import Donation from "../donations/donation.model.js";

const createBankPayment = async (payment)  => {
    try {
        const core = new BankTransfer({
            payment_type: payment.payment_type,
            order_id: payment.invoice_id,
            amount: payment.amount,
            item_details: payment.item_details,
            customer_details: payment.customer_details,
            bank: payment.entity_payment_name
        })

        const midtransResponse = await core.charge()
        return midtransResponse
    } catch (error) {
        throw error
    }
}

const updateDonationByInvoice = async (invoice, status) => {
    try {
        const donation = await Donation.findOneAndUpdate({invoice_id: invoice}, {status: status}, {new: true})
        return generateResponse(donation)
    } catch (error) {
        throw error
    }
}

const paymentService = Object.freeze({
    createBankPayment,
    updateDonationByInvoice
})

export default paymentService