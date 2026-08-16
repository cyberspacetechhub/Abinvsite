const Transaction = require('../models/Transaction')

const getTransactions = async(data) => {
    try {
        let page = data.page || 1
        let limit = data.limit || 10
        let skip = (page - 1) * limit
        const transactions = await Transaction.find().populate('depositMethod').populate('withdrawalMethod').populate('user').sort({createdAt: -1}).skip(skip).limit(limit).populate('user').exec()
        const totalCount = await Transaction.countDocuments()
        if(!transactions) throw new Error('No transactions found')
        return {transactions, page, totalPage: Math.ceil(totalCount/limit)}
    } catch (err) {
       return {error: err.message}
    }
    
}

const getTransaction = async(id) => {
    try {
        const transaction = await Transaction.findById(id)
        .populate("user")
        .populate("depositMethod")
        .populate("withdrawalMethod")
        .populate("investmentPlan")
        .exec()
        if(!transaction) throw new Error('No transaction found')
        return transaction
    } catch (err) {
       return {error: err.message}
    }

}

const deleteTransaction = async(id) => {
    try {
        const transaction = await Transaction.findOne({_id: id})
        if(!transaction) throw new Error('No transaction found')
        const result = await transaction.deleteOne()
        return result
    } catch (err) {
       return {error: err.message}
    }

}

const getTransactionsByUser = async (data) => {
    let page = data.page || 1;
    let limit = data.limit || 10;
    let skip = (page - 1) * limit;
    const userId = data.userId;

    if (!userId) {
      return { error: "User ID is required" };
    }
    try {
      const transactions = await Transaction.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("user")
        .populate("depositMethod")
        .populate("withdrawalMethod")
        .populate("investmentPlan")
        .skip(skip)
        .limit(limit)
        .exec();
      const totalCount = await Transaction.countDocuments();
      return { transactions, page, totalPage: Math.ceil(totalCount / limit) };
    } catch (e) {
      return { error: e.message };
    }
  };

module.exports = {
    getTransactions,
    getTransaction,
    deleteTransaction,
    getTransactionsByUser
}