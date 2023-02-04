const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const authRoute = require('./Routers/auth')
const travelRoute = require('./Routers/travel')

dotenv.config()
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next()
})

// Routes
app.use('/api/auth', authRoute)
app.use('/api/travel', travelRoute)

// Mongoose Connect
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB Connection Sucessfull !!'))
    .catch((err) => console.log(err))

// Port
app.listen(process.env.PORT || 5000, () => {
    console.log('Backend Server is running');
})
