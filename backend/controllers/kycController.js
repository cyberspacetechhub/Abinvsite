const kycService = require('../services/kycService');

const handleSubmitKYC = async (req, res) => {
  const { userId } = req.params;
  const kycData = req.body;
  const files = req.files;

  if (!files || !files.documentImage || !files.selfieImage) {
    return res.status(400).json({ message: 'Document image and selfie are required' });
  }

  const result = await kycService.submitKYC(userId, kycData, files);
  
  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  res.status(201).json({ message: 'KYC submitted successfully', kyc: result });
};

const handleGetPendingKYCs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const result = await kycService.getPendingKYCs(parseInt(page), parseInt(limit));
  
  if (result.error) {
    return res.status(500).json({ message: result.error });
  }

  res.json(result);
};

const handleGetAllKYCs = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  
  const result = await kycService.getAllKYCs(parseInt(page), parseInt(limit));
  
  if (result.error) {
    return res.status(500).json({ message: result.error });
  }

  res.json(result);
};

const handleGetKYCById = async (req, res) => {
  const { kycId } = req.params;
  
  const result = await kycService.getKYCById(kycId);
  
  if (result.error) {
    return res.status(404).json({ message: result.error });
  }

  res.json(result);
};

const handleApproveKYC = async (req, res) => {
  const { kycId } = req.params;
  const { adminId, notes } = req.body;
  
  const result = await kycService.approveKYC(kycId, adminId, notes);
  
  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  res.json({ message: 'KYC approved successfully', kyc: result });
};

const handleRejectKYC = async (req, res) => {
  const { kycId } = req.params;
  const { adminId, notes } = req.body;
  
  if (!notes) {
    return res.status(400).json({ message: 'Rejection notes are required' });
  }
  
  const result = await kycService.rejectKYC(kycId, adminId, notes);
  
  if (result.error) {
    return res.status(400).json({ message: result.error });
  }

  res.json({ message: 'KYC rejected successfully', kyc: result });
};

const handleGetUserKYC = async (req, res) => {
  const { userId } = req.params;
  
  const result = await kycService.getUserKYC(userId);

  if (result === null) {
    return res.status(404).json({ message: 'No KYC submission found for this user' });
  }

  if (result?.error) {
    return res.status(500).json({ message: result.error });
  }

  res.json(result);
};

module.exports = {
  handleSubmitKYC,
  handleGetPendingKYCs,
  handleGetAllKYCs,
  handleGetKYCById,
  handleApproveKYC,
  handleRejectKYC,
  handleGetUserKYC
};