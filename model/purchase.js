const mongoose = require('mongoose');

const ticketPurchaseSchema = new mongoose.Schema({
    registration_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Registration',
        required: true
    },
    tickets: [{
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
    }],
    total_price: {
        type: Number,
        required: true
    },
    purchase_date: {
        type: Date,
        default: Date.now
    }
});

const TicketPurchase = mongoose.model('TicketPurchase', ticketPurchaseSchema);

module.exports = TicketPurchase;
