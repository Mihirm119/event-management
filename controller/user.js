const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

exports.security = async (req, res, next) => {
    try {

        let token = req.headers.authorization;
        if (!token) throw new Error('Please provide token');;

        let validtoken = await User.findById(jwt.verify(token, "event").id);
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
        const { name, email, password, role } = req.body;

        const alreadyexist = await User.findOne({ email: email });
        if (alreadyexist) throw new Error(`${alreadyexist.role} already exists`);

        const hashedPassword = await bcrypt.hash(password, 10);

        const createuser = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            message: `${createuser.role} created successfully`,
            data: createuser
        });
    } catch (error) {
        res.status(404).json({
            message: 'User created Fail',
            error: error.message
        });
    }
};


exports.loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) throw new Error('Please provide email and password');

        let findata = await User.findOne({ email: email });
        if (!findata) throw new Error('Invalid email');

        const isPasswordValid = await bcrypt.compare(password, findata.password);
        if (!isPasswordValid) throw new Error('Invalid password');

        let token = jwt.sign({ id: findata._id }, "event");

        res.status(200).json({
            message: `${findata.role} login successfully`,
            data: findata,
            Token: token
        });
    } catch (error) {
        res.status(404).json({
            message: "login Fail",
            error: error.message
        });
    }
};


exports.readUser = async (req, res) => {
    try {
        const findata = await User.find({ _id: req.user });

        res.status(200).json({
            message: 'User read successfully',
            data: findata
        });
    } catch (error) {
        res.status(404).json({
            message: "read Fail",
            error: error.message
        });
    }
};


exports.updateUser = async (req, res) => {
    try {
        if (!req.params.id) throw new Error('Please provide id');
        if (req.user.toString() !== req.params.id) throw new Error('You are not authorized to update this user');

        const updateuser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updateuser) throw new Error('User not found');

        res.status(200).json({
            message: `${updateuser.role} update successfully`,
            data: updateuser
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
        if (req.user.toString() !== req.params.id) throw new Error('You are not authorized to delete this user');

        const deleteUser = await User.findByIdAndDelete(req.params.id);
        if (!deleteUser) throw new Error('User not found');

        res.status(200).json({
            message: `${deleteUser.role} delete successfully`,
            data: deleteUser
        });
    } catch (error) {
        res.status(404).json({
            message: 'delete Fail',
            error: error.message
        });
    }
};