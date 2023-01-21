import midtransClient from 'midtrans-client';

class MidtransRequest {
    constructor({ payment_type, order_id, amount, item_details, customer_details }) {
        this.core = new midtransClient.CoreApi({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY || 'SB-Mid-server-1n7JkompfA89UzOpSYN-Q_wb',
            clientKey: process.env.MIDTRANS_CLIENT_KEY || 'SB-Mid-client-9vDmHeHXAoy2p-xX'
        })
        this.payment_type = payment_type
        this.order_id = order_id
        this.amount = amount
        this.item_details = item_details
        this.customer_details = customer_details
    }
}

export default MidtransRequest