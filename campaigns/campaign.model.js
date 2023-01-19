import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
    title: { type: String, required: true },
    collected_target: { type: Number, required: true },
    deadline: { type: Date, required: true },
    image: { type: String, required: true },
    slug: { type: String },
    description: { type: String },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: { type: Date, default: Date.now() }
})

campaignSchema.virtual('donations', {
    ref: 'Donation',
    localField: '_id',
    foreignField: 'campaign_id'
})

const Campaign = mongoose.model('Campaign', campaignSchema)

export default Campaign