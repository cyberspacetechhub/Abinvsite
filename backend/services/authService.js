const Client = require('../models/Client');
const bcrypt = require('bcrypt');

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

const handleLoginAttempt = async (email, password) => {
  try {
    const user = await Client.findOne({ email });
    
    if (!user) {
      return { error: 'Invalid credentials' };
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return { error: 'Account temporarily locked. Try again later.' };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      // Increment login attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      
      // Lock account if max attempts reached
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME);
      }
      
      await user.save();
      return { error: 'Invalid credentials' };
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();
    }

    return { user };
  } catch (error) {
    return { error: error.message };
  }
};

const enableWithdrawal = async (userId) => {
  try {
    const user = await Client.findByIdAndUpdate(
      userId,
      { withdrawalEnabled: true },
      { new: true }
    );
    return user;
  } catch (error) {
    return { error: error.message };
  }
};

const disableWithdrawal = async (userId) => {
  try {
    const user = await Client.findByIdAndUpdate(
      userId,
      { withdrawalEnabled: false },
      { new: true }
    );
    return user;
  } catch (error) {
    return { error: error.message };
  }
};

const generateWithdrawalCode = async (userId) => {
  try {
    const user = await Client.findById(userId);
    if (!user) return { error: 'User not found' };
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    await Client.findByIdAndUpdate(userId, {
      withdrawalVerificationCode: code,
      withdrawalCodeExpiry: expiry
    });
    
    // Send email with verification code
    const emailService = require('./emailService');
    await emailService.sendWithdrawalVerificationEmail(user.email, code, user.firstname);
    
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
};

const submitUnlockRequest = async (userId, imageFile) => {
  try {
    const cloudinary = require('cloudinary').v2;
    const sharp = require('sharp');
    
    // Upload image
    const imageBuffer = await sharp(imageFile.data)
      .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    const imageUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "kryptogain/unlock-requests" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(imageBuffer);
    });

    await Client.findByIdAndUpdate(userId, {
      unlockRequestImage: imageUpload.secure_url,
      unlockRequestStatus: 'pending',
      unlockRequestDate: new Date()
    });

    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
};

const approveUnlockRequest = async (userId, adminId) => {
  try {
    const tempCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    const user = await Client.findByIdAndUpdate(userId, {
      unlockRequestStatus: 'approved',
      lockUntil: undefined,
      loginAttempts: 0,
      tempLoginCode: tempCode,
      tempLoginCodeExpiry: expiry
    }, { new: true });

    // Send temp code via email
    const emailService = require('./emailService');
    await emailService.sendTempLoginCode(user.email, tempCode, user.firstname);
    
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
};

const rejectUnlockRequest = async (userId, adminId) => {
  try {
    await Client.findByIdAndUpdate(userId, {
      unlockRequestStatus: 'rejected'
    });
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
};

const submitForgotPasswordRequest = async (email, imageFile) => {
  try {
    const user = await Client.findOne({ email });
    if (!user) return { error: 'User not found' };
    
    const cloudinary = require('cloudinary').v2;
    const sharp = require('sharp');
    
    // Upload image
    const imageBuffer = await sharp(imageFile.data)
      .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    const imageUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "kryptogain/forgot-password" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(imageBuffer);
    });

    await Client.findByIdAndUpdate(user._id, {
      unlockRequestImage: imageUpload.secure_url,
      unlockRequestStatus: 'forgot-password',
      unlockRequestDate: new Date()
    });

    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
};

const loginWithTempCode = async (email, tempCode) => {
  try {
    const user = await Client.findOne({ email });
    if (!user) return { error: 'User not found' };
    
    if (!user.tempLoginCode || user.tempLoginCodeExpiry < new Date()) {
      return { error: 'Temporary code expired' };
    }
    
    if (user.tempLoginCode !== tempCode) {
      return { error: 'Invalid temporary code' };
    }
    
    // Clear temp code and reset login attempts
    await Client.findByIdAndUpdate(user._id, {
      tempLoginCode: undefined,
      tempLoginCodeExpiry: undefined,
      loginAttempts: 0,
      lockUntil: undefined
    });
    
    return { user };
  } catch (error) {
    return { error: error.message };
  }
};

const verifyWithdrawalCode = async (userId, code) => {
  try {
    const user = await Client.findById(userId);
    
    if (!user.withdrawalVerificationCode || 
        !user.withdrawalCodeExpiry || 
        user.withdrawalCodeExpiry < new Date()) {
      return { error: 'Verification code expired' };
    }
    
    if (user.withdrawalVerificationCode !== code) {
      return { error: 'Invalid verification code' };
    }
    
    // Clear verification code after successful verification
    await Client.findByIdAndUpdate(userId, {
      withdrawalVerificationCode: undefined,
      withdrawalCodeExpiry: undefined
    });
    
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = {
  handleLoginAttempt,
  enableWithdrawal,
  disableWithdrawal,
  generateWithdrawalCode,
  verifyWithdrawalCode,
  submitUnlockRequest,
  approveUnlockRequest,
  rejectUnlockRequest,
  loginWithTempCode,
  submitForgotPasswordRequest
};