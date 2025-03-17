const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registrationSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event_id: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, 'Event ID is required']
    },
    registration_date: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Registration', registrationSchema);