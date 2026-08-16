const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InAppMessageSchema = new Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    subject: {
        type: String
    },
    message: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        default: false
    },

}, {timestamps: true});

module.exports = mongoose.model('InAppMessage', InAppMessageSchema);