
const Admin = require('../models/Admin')
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const getAllAdmins = async(data) => {
    let page = parseInt(data.page) || 1;
    let limit = parseInt(data.limit) || 10;
    let skip = (page - 1) * limit
    try {
        const admins = await Admin.find().skip(skip).limit(limit).exec();
        const count = await Admin.countDocuments();
        if(!admins) return {error: 'No admins found'}
        return {admins, page, count};
    } catch (err) {
        return {error: e.message}
    }
};

const createAdmin = async(data) => {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const admin = await Admin.create({
            firstname: data.firstname,
            lastname: data.lastname,
            username: data.username,
            phone: data.phone,
            email: data.email,
            password: hashedPassword,
        });
        return admin;
    } catch (err) {
        return {error: err.message}
    }
};

const updateAdmin = async(id, data) => {
    try {
        const admin = await Admin.findOne({_id: id}).exec()
        if(!admin) return {error: 'Admin not found'}
        admin.firstname = data.firstname;
        admin.lastname = data.lastname;
        admin.username = data.username;
        admin.phone = data.phone;
        admin.email = data.email;
        const result = await admin.save()
        return result
    } catch (err) {
        return {error: e.message};
    }
};

const deleteAdmin = async(id) => {
    try {
        const admin = await Admin.findOne({_id: id}).exec()
        if(!admin) return {error: 'Admin not found'}
        const result = await admin.deleteOne({_id: id})
        return result
    } catch (err) {
        return {error: e.message};
    }
};

const getAdmin = async(id) => {
    try {
        const admin = await Admin.findOne({_id: id}).exec()
        if(!admin) return {error: 'Admin not found'}
        return admin
    } catch (err) {
        return {error: e.message};
    }
};

const adminExists = async(username) => {
    try {
        const admin = await Admin.findOne({username}).exec()
        return admin
    } catch (err) {
        return {error: e.message};
    }
};

module.exports = {
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getAdmin,
    adminExists
}