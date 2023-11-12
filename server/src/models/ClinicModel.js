const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

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

if (process.env.CI !== 'true') {
    ClinicSchema.pre('save', async function (next) {
        const locationData = await geocoder.geocode(this.adress);
        this.location = {
            type: 'Point',
            coordinates: [locationData[0].longitude, locationData[0].latitude], //this is a array of coordinates
            formattedAddress: locationData[0].formattedAddress
        }
        this.adress = undefined;    // this will prevent his from getting saved to the database and instead we will save it as formattedAddress
        console.log(this.location);
        next();
    })
}
module.exports = mongoose.model('Clinic', ClinicSchema);