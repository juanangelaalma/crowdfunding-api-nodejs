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

app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('Hello world').status(200);
});

app.use(`/users`, userRoutes);

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