import multer from 'multer';
import {IMAGES_CAMPAIGN_DIRECTORY} from "./campaign.types.js";
import errorHandler, { HttpError } from "../error_handlers/index.js";
import { createDirectoryIfNotExists } from "../utils/index.js";

const createCampaignStorage = (dir) => {
    createDirectoryIfNotExists(dir)
    return multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, dir)
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`)
        }
    })
}

const storage = createCampaignStorage(IMAGES_CAMPAIGN_DIRECTORY)

const imageFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true)
    } else {
        req.fileValidationError = 'Only .png, .jpg and .jpeg format allowed!'
        return cb(null, false)
    }
}

const upload = multer({ storage, fileFilter: imageFilter })
const uploadMiddleware = upload.single('image')
const imageUpload = uploadMiddleware

const campaignStorages = Object.freeze({
    imageUpload
})

export default campaignStorages

