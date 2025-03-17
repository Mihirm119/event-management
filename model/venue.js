const mongoose = require('mongoose');
const venueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    contact_info: {
        type: String,
        required: true
    }
});

const Venue = mongoose.model('Venue', venueSchema);

module.exports = Venue;