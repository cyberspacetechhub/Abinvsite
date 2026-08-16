const { generateWithdrawalCode, verifyWithdrawalCode, enableWithdrawal, disableWithdrawal } = require('../services/authService');
const Client = require('../models/Client');

const handleGenerateWithdrawalCode = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const user = await Client.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.isVerified) {
      return res.status(403).json({ message: 'KYC verification required for withdrawal' });
    }
    
    if (!user.withdrawalEnabled) {
      return res.status(403).json({ message: 'Withdrawal not enabled for this account' });
    }
    
    const result = await generateWithdrawalCode(userId);
    if (result.error) {
      return res.status(500).json({ message: result.error });
    }
    
    res.json({ message: 'Verification code sent', code: result.code });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleVerifyWithdrawalCode = async (req, res) => {
  const { userId } = req.params;
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({ message: 'Verification code required' });
  }
  
  const result = await verifyWithdrawalCode(userId, code);
  if (result.error) {
    return res.status(400).json({ message: result.error });
  }
  
  res.json({ message: 'Code verified successfully' });
};

const handleEnableWithdrawal = async (req, res) => {
  const { userId } = req.params;
  
  const result = await enableWithdrawal(userId);
  if (result.error) {
    return res.status(500).json({ message: result.error });
  }
  
  res.json({ message: 'Withdrawal enabled for user', user: result });
};

const handleDisableWithdrawal = async (req, res) => {
  const { userId } = req.params;
  
  const result = await disableWithdrawal(userId);
  if (result.error) {
    return res.status(500).json({ message: result.error });
  }
  
  res.json({ message: 'Withdrawal disabled for user', user: result });
};

module.exports = {
  handleGenerateWithdrawalCode,
  handleVerifyWithdrawalCode,
  handleEnableWithdrawal,
  handleDisableWithdrawal
};