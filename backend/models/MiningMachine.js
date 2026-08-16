const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MiningMachineSchema = new Schema({
    machineId: { type: String, required: true, unique: true },
    name:      { type: String, required: true },
    hashrate:  { type: String, required: true },
    price:     { type: Number, required: true },
    dailyRate: { type: Number, required: true },
    description: { type: String },
    image:     { type: String },
    isActive:  { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('MiningMachine', MiningMachineSchema);
