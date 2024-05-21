const app = require('./app');
const mongoose = require('mongoose');
const { loadPlanetsData } = require('./models/planets.model')
require('dotenv').config();

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;

const http = require('http');
const server = http.createServer(app);
mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready');
})

mongoose.connection.on('error', (err) => {
    console.log(MONGO_URL);
    console.error("Error connecting to MongoDB",err);
})
async function startServer() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true

    })
    await loadPlanetsData();
    server.listen(PORT, () => {
        console.log(`Listening on ${PORT}...`)
    })
}

startServer();



