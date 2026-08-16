
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvestmentPlanSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    minAmount: {
        type: Number,
        required: true
    },
    maxAmount: {
        type: Number,
        required: true
    },
    interest: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    noOfTimes: {
        type: Number,
        required: true
    },
    
},{timestamps: true});

const InvestmentPlan = mongoose.model('InvestmentPlan', InvestmentPlanSchema);
module.exports = InvestmentPlan;