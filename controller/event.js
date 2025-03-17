const newevent = require('../model/event');
const organizerID = require('../model/user');
const categoryID = require('../model/category');
const newvanue = require('../model/venue');
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
        const { name, date, venue, description, guest, organizer, category } = req.body;

        const checkevent = await newevent.findOne({ name: name });
        if (checkevent) throw new Error("event is already exist");

        const onlyadmin = await organizerID.findOne({ _id: req.user });
        if (!onlyadmin) throw new Error("category id not found");
        if (onlyadmin.role !== 'admin') throw new Error("You are not authorized to create event");

        const checkorganizer = await organizerID.findOne({ _id: organizer });
        if (!checkorganizer) throw new Error("organizer id not found");

        const checkcategory = await categoryID.findOne({ _id: category });
        if (!checkcategory) throw new Error("category id not found");

        const checkvenue = await newvanue.findOne({ _id: venue });
        if (!checkvenue) throw new Error("Venue id not found");

        const createevent = await newevent.create({
            name,
            date,
            venue,
            description,
            guest,
            category,
            organizer
        });

        res.status(201).json({
            message: "Event Create successfully",
            data: createevent
        });
    } catch (error) {
        res.status(404).json({
            message: 'Event Fail',
            error: error.message
        });
    }
};

exports.readUser = async (req, res) => {
    try {
        const findata = await newevent.find().populate('venue', 'name address capacity contact_info').populate('organizer', 'name email').populate('category', 'name');

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

        const checkorganizer = await organizerID.findOne({ _id: req.body.organizer });
        if (!checkorganizer) throw new Error("organizer id not found");

        const checkcategory = await categoryID.findOne({ _id: req.body.category });
        if (!checkcategory) throw new Error("category id not found");

        const findid = await newevent.findById(req.params.id);
        if (!findid) throw new Error('Event id not found');

        const finduser = await organizerID.findOne({ _id: req.user });
        if (!finduser) throw new Error('User token is not found');

        if (finduser.role !== 'admin') throw new Error('You are not authorized to update this event');

        const eventupdate = await newevent.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!eventupdate) throw new Error('Event not found');

        res.status(200).json({
            message: "Event update successfully",
            data: eventupdate
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

        if (finduser.role !== 'admin') throw new Error('You are not authorized to Delete this event');

        const deleteevent = await newevent.findByIdAndDelete(req.params.id);
        if (!deleteevent) throw new Error('Event Id not found');

        res.status(200).json({
            message: "Event delete successfully",
            data: deleteevent
        });
    } catch (error) {
        res.status(404).json({
            message: ' Event delete Fail',
            error: error.message
        });
    }
};