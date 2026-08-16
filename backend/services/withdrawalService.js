const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const UserWithdrawalAccount = require('../models/UserWithdrawalAccount');
const mongoose = require('mongoose');
const { sendWithdrawalMessage } = require('./emailService');
const { createNotification } = require('./notificationService');
const getWithdrawals = async (data) => {
    let page = data.page || 1;
    let limit = data.limit || 10;
    let skip = (page - 1) * limit;
    try {
        const withdrawals = await Withdrawal.find().sort({createdAt: -1}).skip(skip).limit(limit);
        const count = await Withdrawal.countDocuments();
        if(!withdrawals) return {error: 'Withdrawals not found'}
        return {withdrawals, page, totalPage: Math.ceil(count / limit)}
    } catch (error) {
        return {error: error.message}
    }
}

const createWithdrawal = async (data) => {
    const userId = new mongoose.Types.ObjectId(data.user);

    const client = await User.findById(userId);
    if (!client) return { error: 'Client not found' };
    if (!client.isVerified) return { error: 'Account not verified. Contact support for KYC assistance.' };
    if (client.balance < data.amount) return { error: 'Insufficient funding balance. Withdrawals are only processed from your funding account.' };
    if (client.withdrawalLimit > 0 && data.amount > client.withdrawalLimit) return { error: `Withdrawal exceeds your limit of $${client.withdrawalLimit.toLocaleString()}. Contact support to increase your limit.` };

    try {
        const newWithdrawal = await Withdrawal.create({
            user: userId,
            amount: data.amount,
            withdrawalAccount: data.withdrawalAccount || undefined,
            address: data.address || undefined,
            note: data.note || undefined
        });

        await createNotification(
            userId,
            '📤 Withdrawal Request Submitted',
            `Your withdrawal request of $${data.amount} has been submitted and is pending approval.`,
            'info'
        );

        client.transactions.push(newWithdrawal._id);
        await client.save();
        return { newWithdrawal, updatedClient: client };
    } catch (error) {
        return { error: error.message };
    }
}

const getWithdrawal = async (id) => {
    try{
        const withdrawal = await Withdrawal.findById(id);
        if(!withdrawal) return {error: 'Withdrawal not found'}
        return withdrawal
    } catch (error) {
        return {error: error.message}
    }
}

const withdrawalStatus = async (id, status) => {
    try {

        const withdrawal = await Withdrawal.findById(id).populate('withdrawalAccount').exec();
        if (!withdrawal) {
            return { error: 'withdrawal not found' };
        }

        // console.log("Deposit found: ", deposit);

        withdrawal.status = status;
        const result = await withdrawal.save();
        // console.log("Withdrawal status updated: ", result);

        if (status === 'Completed') {
            // console.log("Updating client balance for status: ", status);

            const user = withdrawal.user; // Assuming deposit has a clientId field
            const client = await User.findById(user);

            if (!client) {
                return { error: "Client not found" };
            }

            client.balance -= withdrawal.amount;
            const clientSaveResult = await client.save();
            const transactionId = withdrawal._id;
            const account = withdrawal.withdrawalAccount;
            const address = account ? (account.address || account.accountNumber) : withdrawal.address;
            const withdrawalMethod = account ? (account.label || account.network || account.bankName) : 'Manual';
            const res = await sendWithdrawalMessage(client.email, withdrawal.amount, transactionId, address, withdrawalMethod);
            
            // Send in-app notification
            await createNotification(
                client._id,
                '💸 Withdrawal Completed',
                `Your withdrawal of $${withdrawal.amount} has been processed and sent to your wallet.`,
                'success'
            );
        }

        return result;
    } catch (error) {
        // console.error("Error: ", error.message);
        return { error: error.message };
    }
};

const getWithdrawalsByUser = async (data) => {
    let page = data.page || 1;
    let limit = data.limit || 10;
    let skip = (page - 1) * limit;
    const userId = data.userId;

    if (!userId) {
      return { error: "User ID is required" };
    }
    try {
      const withdrawals = await Withdrawal.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("user")
        .populate("withdrawalAccount")
        .skip(skip)
        .limit(limit)
        .exec();
      const totalCount = await Withdrawal.countDocuments();
      return { withdrawals, page, totalPage: Math.ceil(totalCount / limit) };
    } catch (err) {
      return { error: err.message };
    }
  };

module.exports = {
    getWithdrawals,
    createWithdrawal,
    getWithdrawal,
    withdrawalStatus,
    getWithdrawalsByUser
}