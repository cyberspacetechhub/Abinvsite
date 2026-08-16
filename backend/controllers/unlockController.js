const { submitUnlockRequest, approveUnlockRequest, rejectUnlockRequest, loginWithTempCode, submitForgotPasswordRequest } = require('../services/authService');
const Client = require('../models/Client');

const handleSubmitUnlockRequest = async (req, res) => {
  const { userId } = req.params;
  const files = req.files;

  if (!files || !files.unlockImage) {
    return res.status(400).json({ message: 'Unlock verification image is required' });
  }

  const result = await submitUnlockRequest(userId, files.unlockImage);
  if (result.error) {
    return res.status(500).json({ message: result.error });
  }

  res.json({ message: 'Unlock request submitted successfully' });
};

const handleGetUnlockRequests = async (req, res) => {
  try {
    const requests = await Client.find({ 
      unlockRequestStatus: { $in: ['pending', 'forgot-password'] }
    }).select('firstname lastname email unlockRequestImage unlockRequestDate unlockRequestStatus');
    
    res.json({ requests });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const handleApproveUnlockRequest = async (req, res) => {
  const { userId } = req.params;
  const { adminId } = req.body;

  const result = await approveUnlockRequest(userId, adminId);
  if (result.error) {
    return res.status(500).json({ message: result.error });
  }

  res.json({ message: 'Unlock request approved and temporary code sent' });
};

const handleRejectUnlockRequest = async (req, res) => {
  const { userId } = req.params;
  const { adminId } = req.body;

  const result = await rejectUnlockRequest(userId, adminId);
  if (result.error) {
    return res.status(500).json({ message: result.error });
  }

  res.json({ message: 'Unlock request rejected' });
};

const handleForgotPasswordRequest = async (req, res) => {
  const { email } = req.body;
  const files = req.files;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (!files || !files.verificationImage) {
    return res.status(400).json({ message: 'Verification image is required' });
  }

  const result = await submitForgotPasswordRequest(email, files.verificationImage);
  if (result.error) {
    return res.status(500).json({ message: result.error });
  }

  res.json({ message: 'Password reset request submitted. Admin will review and send temporary code.' });
};

const handleTempLogin = async (req, res) => {
  const { email, tempCode } = req.body;

  if (!email || !tempCode) {
    return res.status(400).json({ message: 'Email and temporary code required' });
  }

  const result = await loginWithTempCode(email, tempCode);
  if (result.error) {
    return res.status(401).json({ message: result.error });
  }

  res.json({ message: 'Temporary login successful', user: result.user });
};

module.exports = {
  handleSubmitUnlockRequest,
  handleGetUnlockRequests,
  handleApproveUnlockRequest,
  handleRejectUnlockRequest,
  handleTempLogin,
  handleForgotPasswordRequest
};