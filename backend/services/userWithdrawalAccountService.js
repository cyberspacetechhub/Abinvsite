const UserWithdrawalAccount = require('../models/UserWithdrawalAccount');

const addAccount = async (userId, data) => {
    try {
        // If this is the first account, make it default
        const existing = await UserWithdrawalAccount.countDocuments({ user: userId });
        const isDefault = existing === 0;

        const account = await UserWithdrawalAccount.create({
            user: userId,
            type: data.type,
            label: data.label,
            network: data.network || undefined,
            address: data.address || undefined,
            bankName: data.bankName || undefined,
            accountName: data.accountName || undefined,
            accountNumber: data.accountNumber || undefined,
            routingNumber: data.routingNumber || undefined,
            swiftCode: data.swiftCode || undefined,
            isDefault
        });

        return account;
    } catch (error) {
        return { error: error.message };
    }
};

const getUserAccounts = async (userId) => {
    try {
        const accounts = await UserWithdrawalAccount.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
        return { accounts };
    } catch (error) {
        return { error: error.message };
    }
};

const deleteAccount = async (userId, accountId) => {
    try {
        const account = await UserWithdrawalAccount.findOne({ _id: accountId, user: userId });
        if (!account) return { error: 'Account not found or does not belong to this user' };
        await account.deleteOne();
        return { success: true };
    } catch (error) {
        return { error: error.message };
    }
};

const setDefault = async (userId, accountId) => {
    try {
        // Unset all defaults for this user
        await UserWithdrawalAccount.updateMany({ user: userId }, { isDefault: false });
        // Set the selected one as default
        const account = await UserWithdrawalAccount.findOneAndUpdate(
            { _id: accountId, user: userId },
            { isDefault: true },
            { new: true }
        );
        if (!account) return { error: 'Account not found' };
        return account;
    } catch (error) {
        return { error: error.message };
    }
};

module.exports = { addAccount, getUserAccounts, deleteAccount, setDefault };
