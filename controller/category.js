const newcategory = require('../model/category');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    try {
        const { name, description } = req.body;

        const alreadyexist = await newcategory.findOne({ name: name });
        if (alreadyexist) throw new Error("Category name is already exists");

        const createcategory = await newcategory.create({
            name,
            description
        });

        res.status(201).json({
            message: "Category successfully",
            data: createcategory
        });
    } catch (error) {
        res.status(404).json({
            message: 'Category Fail',
            error: error.message
        });
    }
};


exports.readUser = async (req, res) => {
    try {
        const findata = await newcategory.find();

        res.status(200).json({
            message: 'Category read successfully',
            data: findata
        });
    } catch (error) {
        res.status(404).json({
            message: "Category Fail",
            error: error.message
        });
    }
};


exports.updateUser = async (req, res) => {
    try {
        if (!req.params.id) throw new Error('Please provide id');

        const Categoryupdate = await newcategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!Categoryupdate) throw new Error('Category not found');

        res.status(200).json({
            message: "Category successfully",
            data: Categoryupdate
        });
    } catch (error) {
        res.status(404).json({
            message: "Category Fail",
            error: error.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {

        if (!req.params.id) throw new Error('Please provide id');

        const Categorydelete = await newcategory.findByIdAndDelete(req.params.id);
        if (!Categorydelete) throw new Error('User not found');

        res.status(200).json({
            message: "Category delete successfully",
            data: Categorydelete
        });
    } catch (error) {
        res.status(404).json({
            message: 'Category delete Fail',
            error: error.message
        });
    }
};