import MidtransRequest from "./MidtransRequest.js";

class BankTransfer extends MidtransRequest {
    constructor({ payment_type, order_id, amount, item_details, customer_details, bank }) {
        super({ payment_type, order_id, amount, item_details, customer_details })
        this.bank = bank
    }

    generateParameter() {
        return {
            "payment_type": this.payment_type,
            "transaction_details": {
                "gross_amount": this.amount,
                "order_id": this.order_id,
            },
            item_details: this.item_details,
            customer_details: this.customer_details,
            "bank_transfer": {
                "bank": this.bank
            },
            expiry: {
                unit: process.env.PAYMENT_EXPIRY_UNIT,
                duration: process.env.PAYMENT_EXPIRY_DURATION
            }
        }
    }

    async charge() {
        try {
            const parameter = this.generateParameter()
            const response = await this.core.charge(parameter)
            return response
        } catch (error) {
            throw error
        }
    }
}

export default BankTransfer