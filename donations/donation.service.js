import Donation from "./donation.model.js";
import mongoose from "mongoose";
import { HttpError } from "../error_handlers/index.js";

const addHoursToCurrentDate = (hours) => {
    Date.prototype.addHours = function(h) {
        this.setTime(this.getTime() + (h*60*60*1000));
        return this;
    }
    return new Date().addHours(hours)
}

const generateInvoiceId = (prefix) => {
    const date = new Date()
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const milliseconds = date.getMilliseconds()
    return `${prefix}${year}${month}${day}${hour}${minute}${second}${milliseconds}`
}

const createDonation = async (newDonation) => {
    const { name, email, amount, comment, is_anonymous, payment_type, entity_payment_name, user_id, campaign_id } = newDonation
    try {
        const donation = await Donation.create({
            invoice_id: generateInvoiceId('INV'),
            name, email, amount, comment, is_anonymous, payment_type, entity_payment_name,
            deadline: addHoursToCurrentDate(24),
            cost_per_percent: process.env.DONATION_COST_PERCENT,
            payment_status: 'pending',
            user: user_id,
            campaign: campaign_id,
            create_at: Date.now(),
            updated_at: Date.now()
        })
        return generateResponse(donation)
    } catch (error) {
        if(error instanceof mongoose.Error.ValidationError) {
            throw new HttpError(400, 'Invalid campaign id')
        }
        if(error instanceof mongoose.Error.CastError) {
            throw new HttpError(400, 'Invalid campaign id')
        }
        throw new HttpError(500, 'Internal server error')
    }
}

const generateResponse = (donation) => {
    return {
        name: donation.name,
        email: donation.email,
        amount: donation.amount,
        comment: donation.comment,
        is_anonymous: donation.is_anonymous,
        cost_per_percent: donation.cost_per_percent,
        payment_type: donation.payment_type,
        entity_payment_name: donation.entity_payment_name,
        account_number: donation.account_number,
        qr_code: donation.qr_code,
        deadline: donation.deadline,
        payment_status: donation.payment_status,
        paid_at: donation.paid_at,
        created_at: donation.created_at,
        updated_at: donation.updated_at,
        user: donation.user,
        campaign: donation.campaign
    }
}

const donationServices = Object.freeze({
    createDonation
})

export default donationServices