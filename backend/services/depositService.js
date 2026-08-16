
const Deposit = require('../models/Deposit');
const User = require('../models/User');
const mongoose = require('mongoose');
const emailService = require('./emailService');
const { createNotification } = require('./notificationService');

const getDeposits = async (data) => {
    let page = data.page || 1;
    let limit = data.limit || 10;
    let skip = (page - 1) * limit;
    try {
        const deposits = await Deposit.find().populate('depositMethod').populate('user').sort({createdAt: -1}).skip(skip).limit(limit);
        const count = await Deposit.countDocuments();
        if(!deposits) return {error: 'deposits not found'}
        return {deposits, page, totalPage: Math.ceil(count / limit)}
    } catch (error) {
        return {error: error.message}
    }
}

const createDeposit = async (data) => {
    const userId = new mongoose.Types.ObjectId(data.user);
    const depositMethodId = new mongoose.Types.ObjectId(data.depositMethod);
    const targetAccount = data.targetAccount || 'funding';
    try {
        const newDeposit = await Deposit.create({
            user: userId,
            amount: data.amount,
            depositMethod: depositMethodId,
            targetAccount
        });

        await createNotification(
            userId,
            '📤 Deposit Request Submitted',
            `Your deposit request of $${data.amount} to your ${targetAccount} account has been submitted and is pending approval.`,
            'info'
        );

        const client = await User.findById(userId);
        if (!client) return { error: 'Client not found' };
        client.transactions.push(newDeposit._id);
        await client.save();
        return { newDeposit, updatedClient: client };
    } catch (error) {
        return { error: error.message };
    }
}

const getDeposit = async (id) => {
    try{
        const deposit = await Deposit.findById(id);
        if(!deposit) return {error: 'deposit not found'}
        return deposit
    } catch (error) {
        return {error: error.message}
    }
}

const depositStatus = async (id, status) => {
    try {
        // console.log("Starting depositStatus function");

        const deposit = await Deposit.findById(id).populate('depositMethod').exec();
        if (!deposit) {
            return { error: 'Deposit not found' };
        }

        // console.log("Deposit found: ", deposit);

        deposit.status = status;
        const result = await deposit.save();
        // console.log("Deposit status updated: ", result);

        if (status === 'Completed') {
            const accountFieldMap = { funding: 'balance', trading: 'tradingBalance', mining: 'miningBalance' };
            const field = accountFieldMap[deposit.targetAccount] || 'balance';

            const user = deposit.user;
            const client = await User.findById(user);
            if (!client) return { error: 'Client not found' };

            client[field] += deposit.amount;
            await client.save();

            const transactionId = deposit._id;
            const address = deposit.depositMethod.value;
            const depositMethod = deposit.depositMethod.name;
            await emailService.sendDepositMessage(client.email, deposit.amount, transactionId, address, depositMethod);

            await createNotification(
                client._id,
                '💰 Deposit Completed',
                `Your deposit of $${deposit.amount} has been credited to your ${deposit.targetAccount || 'funding'} account.`,
                'success'
            );
        }
        // console.log("Deposit status updated: ", result);
        return result;
    } catch (error) {
        // console.error("Error: ", error.message);
        return { error: error.message };
    }
};

const getDepositsByUser = async (data) => {
    let page = data.page || 1;
    let limit = data.limit || 10;
    let skip = (page - 1) * limit;
    const userId = data.userId;

    if (!userId) {
      return { error: "User ID is required" };
    }
    try {
      const deposits = await Deposit.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("user")
        .populate("depositMethod")
        .skip(skip)
        .limit(limit)
        .exec();
      const totalCount = await Deposit.countDocuments();
      return { deposits, page, totalPage: Math.ceil(totalCount / limit) };
    } catch (error) {
      return { error: error.message };
    }
  };
module.exports = {
    getDeposits,
    createDeposit,
    getDeposit,
    depositStatus,
    getDepositsByUser
}