import mongoose from 'mongoose'

const donationSchema = new mongoose.Schema({
    invoice_id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    comment: { type: String },
    is_anonymous: { type: Boolean, required: true },
    cost_per_percent: { type: Number, required: true },
    payment_type: { type: String, enum: ['bank_transfer', 'emoney', 'cod'], default: 'cod', required: true },
    entity_payment_name: { type: String, required: true },
    account_number: { type: String },
    qr_code: { type: String },
    deadline: { type: Date, required: true },
    payment_status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending', required: true },
    paid_at: { type: Date },
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    }
)

const Donation = mongoose.model('Donation', donationSchema)

export default Donation