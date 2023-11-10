const mongoose = require('mongoose');


const ClinicSchema = new mongoose.Schema({
    clinicId: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // this is the goejson point
            // required: true
        },
        coordinates: {
            type: [Number],
            // required: true
            index: '2dsphere'
        },
        formattedAddress: String
    },
    adress:{ //this will be used to get the coordinates from the api and not get saved to database
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Clinic', ClinicSchema);