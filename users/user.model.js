import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
})

// related to Campaign Schema
userSchema.virtual('campaigns', {
    ref: 'Campaign',
    localField: '_id',
    foreignField: 'user_id'
})

userSchema.virtual('donations', {
    ref: 'Donation',
    localField: '_id',
    foreignField: 'user'
})

const User = mongoose.model('User', userSchema)

export default User