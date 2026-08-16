const {
    addAccount,
    getUserAccounts,
    deleteAccount,
    setDefault
} = require('../services/userWithdrawalAccountService');

const handleAddAccount = async (req, res) => {
    const { userId } = req.params;
    const { type, label, network, address, bankName, accountName, accountNumber, routingNumber, swiftCode } = req.body;

    if (!type || !label) return res.status(400).json({ message: 'type and label are required' });
    if (type === 'crypto' && !address) return res.status(400).json({ message: 'address is required for crypto accounts' });
    if (type === 'bank' && (!bankName || !accountNumber || !accountName)) {
        return res.status(400).json({ message: 'bankName, accountName and accountNumber are required for bank accounts' });
    }

    const result = await addAccount(userId, req.body);
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(201).json(result);
};

const handleGetUserAccounts = async (req, res) => {
    const { userId } = req.params;
    const result = await getUserAccounts(userId);
    if (result.error) return res.status(500).json({ message: result.error });
    res.status(200).json(result);
};

const handleDeleteAccount = async (req, res) => {
    const { userId, id } = req.params;
    const result = await deleteAccount(userId, id);
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(200).json(result);
};

const handleSetDefault = async (req, res) => {
    const { userId, id } = req.params;
    const result = await setDefault(userId, id);
    if (result.error) return res.status(400).json({ message: result.error });
    res.status(200).json(result);
};

module.exports = {
    handleAddAccount,
    handleGetUserAccounts,
    handleDeleteAccount,
    handleSetDefault
};
