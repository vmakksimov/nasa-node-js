const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL;


mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready');
})

mongoose.connection.on('error', (err) => {
    console.log(MONGO_URL);
    console.error("Error connecting to MongoDB", err);
})



async function mongoConnect() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true

    })
}

async function mongoDisconnect() {
    await mongoose.connection.close()
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}