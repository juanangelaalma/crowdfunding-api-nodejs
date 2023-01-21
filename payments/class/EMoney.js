import MidtransRequest from "./MidtransRequest.js";

class EMoney extends MidtransRequest {
    constructor({ order_id, amount, item_details, customer_details, emoney }) {
        super({ payment_type: "emoney", order_id, amount, item_details, customer_details });
        this.emoney = emoney;
    }

    generateParameter() {
        return {
            payment_type: this.emoney,
            transaction_details: {
                order_id: this.order_id,
                gross_amount: this.amount,
            },
            item_details: this.item_details,
            customer_details: this.customer_details,
            expiry: {
                unit: process.env.PAYMENT_EXPIRY_UNIT,
                duration: process.env.PAYMENT_EXPIRY_DURATION,
            }
        }
    }

    async charge() {
        try {
            const parameter = this.generateParameter()
            const response = await this.core.charge(parameter)
            const qrCode = response.actions[0].url
            const deepLink = response.actions[1].url
            return { ...response, qr_code: qrCode, deeplink: deepLink }
        } catch (error) {
            throw error
        }
    }
}

export default EMoney