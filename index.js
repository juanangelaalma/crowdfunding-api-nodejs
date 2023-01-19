import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import database from './database/database.js'
import http from 'http'

const app = express()

const server = http.createServer(app)

dotenv.config()
const APP_PORT = process.env.APP_PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI

// routes
import userRoutes from './users/user.routes.js'
import campaignRoutes from './campaigns/campaign.routes.js'
import storagePath from "./utils/storagePath.js";
import assetsPath from "./utils/assetsPath.js";
import donationRoutes from "./donations/donation.routes.js";

app.use(bodyParser.json())

app.use(`/users`, userRoutes);
app.use('/campaigns', campaignRoutes)
app.use('/donations', donationRoutes)
console.log(assetsPath())
app.use(`/${storagePath()}`, express.static(assetsPath()))

database.init({
    databaseURL: MONGODB_URI,
    options:  {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
})

server.listen(APP_PORT, () => {
    console.log(`Server running on port ${APP_PORT}`);
})