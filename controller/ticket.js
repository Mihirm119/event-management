const newticket = require('../model/ticket');
const newevent = require('../model/event');
const organizerID = require('../model/user');
const jwt = require('jsonwebtoken');

exports.security = async (req, res, next) => {
    try {

        let token = req.headers.authorization;
        if (!token) throw new Error('Please provide token');

        let validtoken = await organizerID.findById(jwt.verify(token, "event").id);
        if (!validtoken) throw new Error('Invalid token');

        req.user = validtoken._id;

        next();

    } catch (error) {
        res.status(404).json({
            message: 'User Token created Fail',
            error: error.message
        });
    }
};


exports.createUser = async (req, res) => {
    try {
        const { event_id, ticket_type, price, quantity_available, quantity_sold, valid_from, valid_until } = req.body;

        const finduser = await organizerID.findOne({ _id: req.user });
        if (!finduser) throw new Error('User token is not found');

        if (finduser.role !== 'admin') throw new Error('You are not authorized to Create this Ticket');

        const findevent = await newevent.findOne({ _id: event_id });
        if (!findevent) throw new Error('Event id not found');

        const createticket = await newticket.create({
            event_id,
            ticket_type,
            price,
            quantity_available,
            quantity_sold,
            valid_from,
            valid_until
        });

        res.status(201).json({
            message: "Ticket Create successfully",
            data: createticket
        });
    } catch (error) {
        res.status(404).json({
            message: 'Ticket Fail',
            error: error.message
        });
    }
};

exports.readUser = async (req, res) => {
    try {
        const findata = await newticket.find()

        res.status(200).json({
            message: 'Event read successfully',
            data: findata
        });
    } catch (error) {
        res.status(404).json({
            message: "Event read Fail",
            error: error.message
        });
    }
};


exports.updateUser = async (req, res) => {
    try {
        if (!req.params.id) throw new Error('Please provide id');

        const { event_id } = req.body;

        if (event_id) {
            const findevent = await newevent.findOne({ _id: event_id });
            if (!findevent) throw new Error('Event id not found');
        }

        const findid = await newticket.findById(req.params.id);
        if (!findid) throw new Error('Ticket id not found');

        const finduser = await organizerID.findOne({ _id: req.user });
        if (!finduser) throw new Error('User token is not found');

        if (finduser.role !== 'admin') throw new Error('You are not authorized to update this Ticket');

        const updateticket = await newticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateticket) throw new Error('Event not found');

        res.status(200).json({
            message: "Ticket update successfully",
            data: updateticket
        });
    } catch (error) {
        res.status(404).json({
            message: "update Fail",
            error: error.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {

        if (!req.params.id) throw new Error('Please provide id');

        const finduser = await organizerID.findOne({ _id: req.user });
        if (!finduser) throw new Error('User token is not found');

        if (finduser.role !== 'admin') throw new Error('You are not authorized to Delete this Ticket');

        const deleteticket = await newticket.findByIdAndDelete(req.params.id);
        if (!deleteticket) throw new Error('Tickey Id not found');

        res.status(200).json({
            message: "Ticket delete successfully",
            data: deleteticket
        });
    } catch (error) {
        res.status(404).json({
            message: ' Ticket delete Fail',
            error: error.message
        });
    }
};