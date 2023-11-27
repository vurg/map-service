const dotenv = require("dotenv")
// load env variables
dotenv.config({ path:'.env'})

const NodeGeocoder = require('node-geocoder');

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdapter: 'https',

  apiKey: process.env.GEOCODER_API, // for Mapquest, OpenCage, APlace, Google Premier
  formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;