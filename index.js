import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import database from './database/database.js'
import http from 'http'

const app = express()

const server = http.createServer(app)

dotenv.config()
const APP_PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI

// routes
import userRoutes from './users/user.routes.js'
import campaignRoutes from './campaigns/campaign.routes.js'

app.use(bodyParser.json())
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json')
    next()
})

app.use(`/users`, userRoutes);
app.use('/campaigns', campaignRoutes)
app.use('/uploads', express.static('uploads'))

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