const express = require('express');
const router = express.Router();
const InAppMessage = require('../models/InAppMessage');
const Client = require('../models/Client');
const User = require('../models/User');

// Get unread notification count for clients
router.get('/unread-count', async (req, res) => {
  try {
    const client = await Client.findOne({ email: req.user });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    
    const count = await InAppMessage.countDocuments({ 
      receiver: client._id, 
      read: false 
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get unread counts for admin sections
router.get('/admin/kyc-count', async (req, res) => {
  try {
    const admin = await User.findOne({ email: req.user });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    const count = await Client.countDocuments({ 
      kycStatus: 'pending' 
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/admin/unlock-count', async (req, res) => {
  try {
    const admin = await User.findOne({ email: req.user });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    const UnlockRequest = require('../models/UnlockRequest');
    const count = await UnlockRequest.countDocuments({ 
      status: 'pending' 
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/admin/withdrawal-count', async (req, res) => {
  try {
    const admin = await User.findOne({ email: req.user });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    const Withdrawal = require('../models/Withdrawal');
    const count = await Withdrawal.countDocuments({ 
      status: 'pending' 
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/admin/deposit-count', async (req, res) => {
  try {
    const admin = await User.findOne({ email: req.user });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    const Deposit = require('../models/Deposit');
    const count = await Deposit.countDocuments({ 
      status: 'pending' 
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/admin/investment-count', async (req, res) => {
  try {
    const admin = await User.findOne({ email: req.user });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    const Investment = require('../models/Investment');
    const count = await Investment.countDocuments({ 
      status: 'pending' 
    });
    
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;