const newRegistration = require('../model/registration');
const newevent = require('../model/event');
const newvenue = require('../model/venue');
const userID = require('../model/user');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

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
        const { user_id, event_id, registration_date } = req.body;

        const finduser = await userID.findOne({ _id: req.user });
        if (!finduser) throw new Error('user id not found');

        const findevent = await newevent.findOne({ _id: event_id });
        if (!findevent) throw new Error('Event id not found');

        const findvenue = await newvenue.find();

        const alreadyexistRegistration = await newRegistration.findOne({ user_id: req.user, event_id });
        if (alreadyexistRegistration) throw new Error('Registration already exist');

        const createregistration = await newRegistration.create({
            user_id: req.user,
            event_id,
            registration_date,
        });

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "makwanamihir201@gmail.com",
                pass: "burdwwerduytweue",
            },
        });
        async function sendConfirmationEmail() {
            const info = await transporter.sendMail({
                from: '"Event Management Team" <makwanamihir201@gmail.com>',
                to: finduser.email, // Send email to the registered user
                subject: "🎉 Event Registration Confirmation - Thank You for Joining!",
                text: `Dear ${finduser.name},\n\nWe are pleased to confirm your registration for our upcoming event.`,
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; max-width: 600px; margin: auto;">
                        <h2 style="color: #2c3e50;">🎉 Registration Confirmation</h2>
                        <p>Dear ${finduser.name},</p>
                        <p>We are pleased to confirm your registration for our upcoming event. Below are the event details:</p>
        
                        <h3 style="color: #2c3e50;">📅 Event Details:</h3>
                        <ul style="background: #f9f9f9; padding: 15px; border-radius: 5px; list-style: none; border: 1px solid #ddd;">
                            <li><strong>Event Name:</strong> ${findevent.name}</li>
                            <li><strong>Date:</strong> 7 Aug 2025</li>
                            <li><strong>Time:</strong> 10:00 AM</li>
                            <li><strong>Organizer:</strong> Priyesh Patel</li>
                            <li><strong>Special Guest:</strong> <span style="color: #e67e22;">MS Dhoni</span></li>
                            <li><strong>Managed By:</strong> Mihir Makwana</li>
                        </ul>
        
                        <p style="margin-top: 20px;">We are excited about your participation in this event and look forward to seeing you there. If you have any questions or need further information, please don't hesitate to contact our support team.</p>
        
                        <p style="margin-top: 20px; font-weight: bold;">Best regards,</p>
                        <p style="font-weight: bold;">Event Management Team</p>
                        <p>Contact: 5645673456 </p>
                    </div>
                `,
            });

            console.log("Confirmation email sent successfully. Message ID:", info.messageId);
        }

        await sendConfirmationEmail();

        res.status(201).json({
            message: "Registration Create successfully",
            data: createregistration
        });
    } catch (error) {
        res.status(404).json({
            message: 'Registration Fail',
            error: error.message
        });
    }
};

exports.readUser = async (req, res) => {
    try {
        let findata = await userID.findOne({ _id: req.user })
        if (!findata) throw new Error('User not found')
        let registerdata;

        if (findata.role === "admin") {
            registerdata = await newRegistration.find()
                .populate('user_id', 'name role')
                .populate({
                    path: 'event_id',
                    populate: [
                        { path: 'category', select: 'name' },
                        { path: 'organizer', select: 'name' },
                        { path: 'venue' },
                    ]
                })
        }
        else {
            registerdata = await newRegistration.find({ user_id: req.user })
                .populate('user_id', 'name role')
                .populate({
                    path: 'event_id',
                    populate: [
                        { path: 'category', select: 'name' },
                        { path: 'organizer', select: 'name' },
                        { path: 'venue' }
                    ]
                })
        }

        res.status(200).json({
            message: 'Registration read successfully',
            data: registerdata
        });
    } catch (error) {
        res.status(404).json({
            message: "Registration read Fail",
            error: error.message
        });
    }
};


exports.updateUser = async (req, res) => {
    try {
        if (!req.params.id) throw new Error('Please provide id');
        const { event_id } = req.body;

        const findregistration = await newRegistration.findOne({ _id: req.params.id });
        if (!findregistration) throw new Error('Registration id not found');

        const finduser = await userID.findOne({ _id: req.user });
        if (!finduser) throw new Error('User token is not found');

        const findevent = await newevent.findOne({ _id: event_id });
        if (!findevent) throw new Error('event id is not found');

        if (req.user.toString() !== findregistration.user_id.toString()) throw new Error('You are not authorized to update this Registration');

        const updateresgistration = await newRegistration.findByIdAndUpdate(req.params.id, {
            event_id,
        }, { new: true })

        res.status(200).json({
            message: "Registration update successfully",
            data: updateresgistration
        });
    } catch (error) {
        res.status(404).json({
            message: "Registration update Fail",
            error: error.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {

        if (!req.params.id) throw new Error('Please provide id');

        const finduser = await userID.findOne({ _id: req.user });
        if (!finduser) throw new Error('User token is not found');

        const findregistration = await newRegistration.findOne({ _id: req.params.id });
        if (!findregistration) throw new Error('Registration id not found');

        if (findregistration.user_id.toString() !== req.user.toString()) throw new Error('You are not authorized to delete this Registration');

        const deleteregisration = await newRegistration.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Registration delete successfully",
            data: deleteregisration
        });
    } catch (error) {
        res.status(404).json({
            message: "Registration delete Fail",
            error: error.message
        });
    }
};


