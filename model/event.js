const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: [true , 'Please provide a name']
    },
    date: {
        type: Date,
        required: [true , 'Please provide a date']
    },
    venue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue',
        required: [true , 'Please provide a venue'],
    },
    description: {
        type: String,
        require: [true , 'Please provide a description'],
        trim: true
    },
    guest: {
        type: String,
        required: [true, 'Please provide a organizer'],
        trim: true
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a organizer']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please provide a category']
    },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;