import mongoose from "mongoose";

const initialize = ({ databaseURL, options }) => {
    mongoose.connect(databaseURL, options)

    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'MongoDB connection error:'))

    db.on('open', () => {
        console.log('Connected to MongoDB')
    })
}

const database = Object.freeze({
    init: initialize
})

export default database