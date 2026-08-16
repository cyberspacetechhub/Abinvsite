 const mongoose = require('mongoose');
 const Schema = mongoose.Schema;

 const options = {
    discriminatorKey: 'type'
  }
 const TransactionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Declined', "Approved"],
        default: 'Pending'
    }
 }, {timestamps: true, ...options});

 const Transaction = mongoose.model('Transaction', TransactionSchema);
 module.exports = Transaction;