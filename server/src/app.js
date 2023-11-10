const express = require('express')
// const bodyParser = require('body-parser') this is already included inside express
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const clinicsRouter = require('./routes/clinics');

// load env variables
dotenv.config({ path:'../.env'})

//variables
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/MapServiceDB';
const port = process.env.PORT || 8081;
 
// Connect to MongoDB
mongoose.connect(mongoURI).catch(function (err) {
    if (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err.stack);
        process.exit(1);
    }
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);
});

const app = express()
app.use(morgan('combined'))
app.use(express.json())
app.use(cors())

const env = app.get('env');
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: env === 'development' ? err : {}
    });
});

//routes
app.use('/api/v1', clinicsRouter);


app.listen(port, function (err) {
    if (err) throw err;
    console.log(`Express server listening on port ${port}`);
    console.log(`Backend: http://localhost:${port}/api/`);
});