const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    ticket_type: {
        type: String,
        enum: ['regular', 'VIP'],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity_available: {
        type: Number,
        required: true
    },
    quantity_sold: {
        type: Number,
        default: 0
    },
    valid_from: {
        type: Date,
        required: true
    },
    valid_until: {
        type: Date,
        required: true
    }
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;