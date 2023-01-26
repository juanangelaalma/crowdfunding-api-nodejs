import Campaign from "./campaign.model.js";
import path from "path";
import {IMAGES_CAMPAIGN_DIRECTORY} from "./campaign.types.js";
import storagePath from "../utils/storagePath.js";
import mongoose from "mongoose";
import Donation from "../donations/donation.model.js";
import { HttpError } from "../error_handlers/index.js";

const addDaysToCurrentDate = (days) => {
    const currentDate = new Date()
    return currentDate.setDate(currentDate.getDate() + days)
}

const getFullUriImage = (image) => {
    const baseUrl = process.env.APP_BASE_URL
    const imageDirectory = path.relative('.', storagePath(IMAGES_CAMPAIGN_DIRECTORY))
    return `${baseUrl}/${imageDirectory}/${image.filename}`
}

const createCampaign = async ({ title, collected_target, duration, image, slug, description, user_id }) => {
    const deadline = addDaysToCurrentDate(duration)
    const campaign = await Campaign.create({
        title, collected_target, deadline, image: getFullUriImage(image), slug, description, user: user_id
    })
    return generateResponse(campaign)
}

const getAllCampaigns = async () => {
    const campaigns = await Campaign.aggregate([
        {
            $lookup: {
                from: 'donations',
                localField: 'donations',
                foreignField: '_id',
                as: 'donations',
            },
        },
        {
            $unwind: {
                path: '$donations',
                preserveNullAndEmptyArrays: true,
            }
        },
        {
            $group: {
                _id: '$_id',
                title: { $first: '$title' },
                collected_target: { $first: '$collected_target' },
                deadline: { $first: '$deadline' },
                image: { $first: '$image' },
                slug: { $first: '$slug' },
                description: { $first: '$description' },
                created_at: { $first: '$created_at' },
                donationsCount: {
                    $sum: {
                        $cond: {
                            if: { $eq: ['$donations.payment_status', 'success'] },
                            then: 1,
                            else: 0,
                        }
                    }
                },
                totalAmount: {
                    $sum: {
                        $cond: {
                            if: { $eq: ['$donations.payment_status', 'success'] },
                            then: '$donations.amount',
                            else: 0,
                        }
                    }
                },
            }
        }
    ])
    return campaigns;
}

const getCampaignById = async (campaignId) => {
    try {
        const campaign = await Campaign.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(campaignId) } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'donations',
                    localField: 'donations',
                    foreignField: '_id',
                    as: 'donations'
                }
            },
            {
                $unwind: {
                    path: '$donations',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'donations.user',
                    foreignField: '_id',
                    as: 'donations.user'
                }
            },
            {
                $unwind: {
                    path: '$donations.user',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$title' },
                    collected_target: { $first: '$collected_target' },
                    deadline: { $first: '$deadline' },
                    image: { $first: '$image' },
                    slug: { $first: '$slug' },
                    description: { $first: '$description' },
                    user: { $first: '$user' },
                    totalAmount: { $sum: '$donations.amount' },
                    donationsCount: {
                        $sum: {
                            $cond: [
                                { $eq: ['$donations.payment_status', 'success'] }, 1, 0
                            ]
                        }
                    },
                    donations: {
                        $push: {
                            $cond: [
                                { $eq: ['$donations.payment_status', 'success'] }, '$donations', "$$REMOVE"
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    collected_target: 1,
                    deadline: 1,
                    image: 1,
                    slug: 1,
                    description: 1,
                    user: {
                        _id: '$user._id',
                        name: '$user.name',
                        email: '$user.email'
                    },
                    totalAmount: 1,
                    donationsCount: 1,
                    donations: {
                        $map: {
                            input: '$donations',
                            as: 'donation',
                            in: {
                                _id: '$$donation._id',
                                amount: '$$donation.amount',
                                payment_status: '$$donation.payment_status',
                                user: {
                                    _id: '$$donation.user._id',
                                    name: '$$donation.user.name',
                                    email: '$$donation.user.email'
                                }
                            }
                        }
                    }
                }
            }
        ])
        if (!campaign) {
            throw new HttpError(404, 'Campaign not found')
        }
        return campaign
    } catch (error) {
        console.log(error)
        if(error instanceof mongoose.Error.CastError) {
            throw new HttpError(400, 'Invalid campaign id')
        }
        if(error instanceof HttpError) {
            throw error
        }
        throw new HttpError(500, 'Internal server error')
    }
}

const deleteCampaign = async (campaignId) => {
    try {
        const campaign = await Campaign.findByIdAndDelete(campaignId)
        if (!campaign) {
            throw new HttpError(404, 'Campaign not found')
        }
        return generateResponse(campaign)
    } catch (error) {
        if(error instanceof mongoose.Error.CastError) {
            throw new HttpError(400, 'Invalid campaign id')
        }
        if(error instanceof HttpError) {
            throw error
        }
        throw new HttpError(500, 'Internal server error')
    }
}

const generateResponse = (campaign) => {
    return {
        _id: campaign._id,
        title: campaign.title,
        collected_target: campaign.collected_target,
        deadline: campaign.deadline,
        image: campaign.image,
        slug: campaign.slug,
        description: campaign.description,
        created_at: campaign.created_at,
        user: campaign.user
    }
}

const getCampaignComments = async (campaignId) => {
    try {
        const comments = await Donation.aggregate([
            {
                $match: {
                    campaign: mongoose.Types.ObjectId(campaignId),
                    payment_status: 'success',
                    comment: { $ne: null }
                }
            },
            {
                $group: {
                    _id: '$_id',
                    comment: { $first: '$comment' },
                    name: { $first: '$name' },
                    created_at: { $first: '$created_at' }
                }
            },
            {
                $sort: {
                    created_at: -1
                }
            }
        ])

        return comments
    } catch (error) {
        if(error instanceof mongoose.Error.CastError) {
            throw new HttpError(400, 'Invalid campaign id')
        }
        throw new HttpError(500, 'Internal server error')
    }
}

const getCampaignDonors = async (campaignId) => {
    try {
        const donors = await Donation.aggregate([
            {
                $match: {
                    campaign: mongoose.Types.ObjectId(campaignId),
                }
            },
            {
                $group: {
                    _id: '$email',
                    name: { $first: '$name' },
                    created_at: { $first: '$created_at' },
                    total_amount: {
                        $sum: {
                            $cond: {
                                if: { $eq: ['$payment_status', 'success'] },
                                then: '$amount',
                                else: 0
                            }
                        }
                    },
                }
            },
            {
                $match: {
                    total_amount: { $gt: 0 }
                }
            },
            {
                $sort: {
                    created_at: -1
                }
            }
        ])

        return donors
    } catch (error) {
        if(error instanceof mongoose.Error.CastError) {
            throw new HttpError(400, 'Invalid campaign id')
        }
        if(error.name === 'BSONTypeError') {
            throw new HttpError(400, 'Invalid campaign id')
        }
        throw new HttpError(500, 'Internal server error')
    }
}

const campaignService = Object.freeze({
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    deleteCampaign,
    getCampaignComments,
    getCampaignDonors,
})

export default campaignService