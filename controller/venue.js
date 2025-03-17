const newvanue = require('../model/venue');
const userID = require('../model/user');
const jwt = require('jsonwebtoken');

exports.security = async (req, res, next) => {
    try {

        let token = req.headers.authorization;
        if (!token) throw new Error('Please provide token');

        let validtoken = await userID.findById(jwt.verify(token, "event").id);
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
        const { name, address, capacity, contact_info } = req.body;

        const finduser = await userID.findOne({ _id: req.user });
        if (!finduser) throw new Error('User token is not found');

        if (finduser.role !== 'admin') throw new Error('You are not authorized to Create this Venue');

        const alreadyVensu = await newvanue.findOne({ name: name });
        if (alreadyVensu) throw new Error('Venue already Created');

        const createvenuse = await newvanue.create({
            name,
            address,
            capacity,
            contact_info,
        });

        res.status(201).json({
            message: "Venue Create successfully",
            data: createvenuse
        });
    } catch (error) {
        res.status(404).json({
            message: 'Venue Fail',
            error: error.message
        });
    }
};

exports.readUser = async (req, res) => {
    try {
        const findata = await newvanue.find()

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

        const findvansue = await newvanue.findById(req.params.id);
        if (!findvansue) throw new Error('Venue id not found');

        const finduser = await userID.findOne({ _id: req.user });
        if (!finduser) throw new Error('User token is not found');

        if (finduser.role !== 'admin') throw new Error('You are not authorized to update this Venue');

        const updatevenue = await newvanue.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatevenue) throw new Error('Event not found');

        res.status(200).json({
            message: "Venue update successfully",
            data: updatevenue
        });
    } catch (error) {
        res.status(404).json({
            message: "Venue update Fail",
            error: error.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {

        if (!req.params.id) throw new Error('Please provide id');

        const finduser = await userID.findOne({ _id: req.user });
        if (!finduser) throw new Error('User token is not found');

        if (finduser.role !== 'admin') throw new Error('You are not authorized to Delete this Ticket');

        const deletevenue = await newvanue.findByIdAndDelete(req.params.id);
        if (!deletevenue) throw new Error('Tickey Id not found');

        res.status(200).json({
            message: "Venue delete successfully",
            data: deletevenue
        });
    } catch (error) {
        res.status(404).json({
            message: 'Venue delete Fail',
            error: error.message
        });
    }
};