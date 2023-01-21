import MidtransRequest from "./MidtransRequest.js";

class BankTransfer extends MidtransRequest {
    constructor({ order_id, amount, item_details, customer_details, bank, echannel }) {
        super({ payment_type: "bank_transfer", order_id, amount, item_details, customer_details })
        this.bank = bank
    }

    generateParameter() {
        const params = {
            "payment_type": this.payment_type,
            "transaction_details": {
                "gross_amount": this.amount,
                "order_id": this.order_id,
            },
            item_details: this.item_details,
            customer_details: this.customer_details,
            expiry: {
                unit: process.env.PAYMENT_EXPIRY_UNIT,
                duration: process.env.PAYMENT_EXPIRY_DURATION
            }
        }

        if(this.bank === "echannel") {
            params.payment_type = "echannel"
            params.echannel = {
                "bill_info1" : "Pembayaran: Donasi di AyoDonasi",
                "bill_info2" : "Terima kasih telah berdonasi"
            }
        }else {
            params.bank_transfer = {
                bank: this.bank
            }
        }

        return params
    }

    getVaNumber(response) {
        if (response.va_numbers) {
            return response.va_numbers[0].va_number
        }
        if (response.permata_va_number) {
            return response.permata_va_number
        }
        if (response.bill_key) {
            return `${response.bill_key},${response.biller_code}`
        }
    }

    async charge() {
        try {
            const parameter = this.generateParameter()
            const response = await this.core.charge(parameter)
            const vaNumber = this.getVaNumber(response)
            return { ...response, va_number: vaNumber }
        } catch (error) {
            throw error
        }
    }
}

export default BankTransfer