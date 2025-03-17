const newticket = require('../model/ticket');
const newpurchase = require('../model/purchase');
const registrationID = require('../model/registration');
const newevent = require('../model/event');
const userId = require('../model/user');
const jwt = require('jsonwebtoken');

exports.security = async (req, res, next) => {
    try {

        let token = req.headers.authorization;
        if (!token) throw new Error('Please provide token');

        let validtoken = await userId.findById(jwt.verify(token, "event").id);
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
        const { registration_id, tickets, purchase_date } = req.body;
        const finduser = await userId.findOne({ _id: req.user });
        if (!finduser) throw new Error('User token is not found');

        if (!registration_id) throw new Error('Please provide registration id');

        const Registration = await registrationID.findOne({ _id: registration_id });
        if (!Registration) throw new Error('Registration ID is not found');

        if (Registration.user_id.toString() !== finduser._id.toString()) throw new Error('You are not authorized to Purchase this Ticket');

        if (!tickets) throw new Error("Please Enter Tickets");

        let totalprice = [];
        let arraypush = [];
        let ticketsArray = [];
        let totalsum = 0;
        for (const array of tickets) {
            if (!array.ticket) throw new Error("Please Enter Ticket");

            let addticket = array.ticket;
            const alreadypurchase = await newpurchase.findOne({ registration_id, 'tickets.ticket': addticket });
            if (alreadypurchase) throw new Error('You have already purchased this ticket');

            const findticket = await newticket.findOne({ _id: addticket });
            if (!findticket) throw new Error('Ticket Id is not define');

            if (arraypush.includes(addticket)) {
                throw new Error("Please enter a different ticket ID, each ticket ID must be unique");
            }
            arraypush.push(addticket);
            if (!array.quantity) throw new Error("Please Enter quantity");
            totalprice.push(findticket.price * array.quantity);

            const priceupdate = await newticket.findByIdAndUpdate(addticket, {
                quantity_available: findticket.quantity_available - array.quantity,
                quantity_sold: findticket.quantity_sold + array.quantity
            }, { new: true });

            ticketsArray.push({
                ticket: addticket,
                quantity: array.quantity,
            });
        }

        totalprice.map((val) => {
            totalsum += val
        })

        const createpurchase = await newpurchase.create({
            registration_id,
            tickets,
            total_price: totalsum,
            purchase_date
        });

        res.status(201).json({
            message: "Purchase Create successfully",
            data: createpurchase
        });
    } catch (error) {
        res.status(404).json({
            message: 'Purchase Ticket Fail',
            error: error.message
        });
    }
};

exports.readUser = async (req, res) => {
    try {
        const finduser = await userId.findOne({ _id: req.user });
        if (!finduser) throw new Error('User token is not found');
        let findata;

        if (finduser.role === 'admin') {
            findata = await newpurchase.find()
                .populate({
                    path: 'registration_id', // Populate registration_id field
                    populate: [
                        { path: 'user_id', select: 'name role' }, // Populate user_id under registration_id
                        {
                            path: 'event_id', select: 'venue organizer', // Populate event_id under registration_id
                            populate: [
                                { path: 'venue', select: 'name address capacity contact_info' },
                                { path: 'organizer', select: 'name' },
                            ]
                        }
                    ]
                }).populate('tickets.ticket', 'ticket_type price quantity_available quantity_sold valid_from valid_until');
        } else {
            const findregistration = await registrationID.findOne({ user_id: finduser._id });
            if (!findregistration) throw new Error('Registration Id is not define');

            findata = await newpurchase.find({ registration_id: findregistration._id })
                .populate({
                    path: 'registration_id', // Populate registration_id field
                    populate: [
                        { path: 'user_id', select: 'name role' }, // Populate user_id under registration_id
                        {
                            path: 'event_id', select: 'venue organizer', // Populate event_id under registration_id
                            populate: [
                                { path: 'venue', select: 'name address capacity contact_info' },
                                { path: 'organizer', select: 'name' },
                            ]
                        }
                    ]
                }).populate('tickets.ticket', 'ticket_type price quantity_available quantity_sold valid_from valid_until');
        }

        if (!findata) throw new Error('Purchase Id is not define');

        res.status(200).json({
            message: 'Purchase read successfully',
            data: findata
        });
    } catch (error) {
        res.status(404).json({
            message: "Purchase read Fail",
            error: error.message
        });
    }
};



exports.updateUser = async (req, res) => {
    try {
        if (!req.params.id) throw new Error('Please provide id');
        const { ticket_id, total_price, add_ticket, remover_ticket } = req.body;

        const registrationcheck = await registrationID.findOne({ user_id: req.user });
        if (!registrationcheck) throw new Error('User is not Register');

        const purchaseidcheck = await newpurchase.findById(req.params.id);
        if (!purchaseidcheck) throw new Error('purchase is not Found');

        if (registrationcheck._id.toString() !== purchaseidcheck.registration_id.toString()) throw new Error('You are not authorized to update this Purchase');

        if (!ticket_id) throw new Error('Please provide tickets');

        let findticket = await newpurchase.findOne({
            registration_id: purchaseidcheck.registration_id,
            'tickets.ticket': ticket_id,
        });
        if (!findticket) throw new Error('ticket Id is not found');
        if (!add_ticket && !remover_ticket) throw new Error('Please provide add_ticket or remover_ticket');

        let updatequealtily = findticket.tickets.find((val) => val.ticket.toString() === ticket_id.toString())

        if (add_ticket) {
            updatequealtily.quantity += add_ticket;  // Add tickets

            let tickettotal = await newticket.findOne({ _id: ticket_id })
            const updatealso = await newticket.findByIdAndUpdate(ticket_id, {
                quantity_sold: tickettotal.quantity_sold += add_ticket,
            }, { new: true })

            await newpurchase.findByIdAndUpdate(req.params.id, {
                'tickets.$[elem].quantity': updatequealtily.quantity,
                total_price: purchaseidcheck.total_price + tickettotal.price * add_ticket
            }, {
                new: true,
                arrayFilters: [{ 'elem.ticket': ticket_id }]  // Ensures that only the specific ticket is updated
            });
        }

        if (remover_ticket) {
            updatequealtily.quantity -= remover_ticket;  // Add tickets

            await newpurchase.findByIdAndUpdate(req.params.id, {
                'tickets.$[elem].quantity': quelityaddemove
            }, {
                new: true,
                arrayFilters: [{ 'elem.ticket': ticket_id }]  // Ensures that only the specific ticket is updated
            });
        }

        res.status(200).json({
            message: "Purchase update successfully",
            data: updatequealtily
        });
    } catch (error) {
        res.status(404).json({
            message: "Purchase update Fail",
            error: error.message
        });
    }
};



exports.deleteUser = async (req, res) => {
    try {

        if (!req.params.id) throw new Error('Please provide id');

        const finduser = await userId.findOne({ _id: req.user });
        if (!finduser) throw new Error('User token is not found');

        const registrationcheck = await registrationID.findOne({ user_id: req.user });
        if (!registrationcheck) throw new Error('User is not Register');

        const purchaseidcheck = await newpurchase.findById(req.params.id);
        if (!purchaseidcheck) throw new Error('purchase is not Found');

        if (registrationcheck._id.toString() !== purchaseidcheck.registration_id.toString()) throw new Error('You are not authorized to Delete this Purchase');

        const deleteticket = await newpurchase.findByIdAndDelete(req.params.id);
        if (!deleteticket) throw new Error('Tickey Id not found');

        res.status(200).json({
            message: "Purchase delete successfully",
            data: deleteticket
        });
    } catch (error) {
        res.status(404).json({
            message: 'Purchase delete Fail',
            error: error.message
        });
    }
};