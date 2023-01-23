import mongoose from "mongoose";


// TODO: change campaign schema to inclue donations
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
    donations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Donation'
    }],
    created_at: { type: Date, default: Date.now() }
})

// campaignSchema.virtual('donations', {
//     ref: 'Donation',
//     localField: '_id',
//     foreignField: 'campaign',
//     populate: {
//         path: 'user',
//         model: 'User',
//         select: '_id name email'
//     }
// })
campaignSchema.set('toJSON', { virtuals: true })
campaignSchema.set('toObject', { virtuals: true })

const Campaign = mongoose.model('Campaign', campaignSchema)

export default Campaign