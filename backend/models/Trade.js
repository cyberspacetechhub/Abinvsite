
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TradeSchema = new Schema({
    investment: {
        type: Schema.Types.ObjectId,
        ref: "Investment",
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    dueDate: {
        type: Date,
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: "Client",
        required: true,
    },
    processed: {
        type: Boolean,
        default: false,
    },
    rejected: {
        type: Boolean,
        default: false,
    },
    processedAt: {
        type: Date,
    },
}, {timestamps: true})

module.exports = mongoose.model('Trade', TradeSchema)