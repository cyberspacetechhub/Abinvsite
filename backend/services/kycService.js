const KYC = require('../models/KYC');
const Client = require('../models/Client');
const cloudinary = require("cloudinary").v2;
const sharp = require('sharp');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const submitKYC = async (userId, kycData, files) => {
  try {
    // Check if user already has KYC submission
    const existingKYC = await KYC.findOne({ userId });
    if (existingKYC) {
      return { error: 'KYC already submitted' };
    }

    // Upload document image
    const documentBuffer = await sharp(files.documentImage.data)
      .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    const documentUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "kryptogain/kyc/documents" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(documentBuffer);
    });

    // Upload selfie image
    const selfieBuffer = await sharp(files.selfieImage.data)
      .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toBuffer();

    const selfieUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "kryptogain/kyc/selfies" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(selfieBuffer);
    });

    // Create KYC record
    const kyc = new KYC({
      userId,
      documentType: kycData.documentType,
      documentNumber: kycData.documentNumber,
      documentImage: documentUpload.secure_url,
      selfieImage: selfieUpload.secure_url,
      fullName: kycData.fullName,
      dateOfBirth: new Date(kycData.dateOfBirth),
      address: kycData.address,
      country: kycData.country
    });

    await kyc.save();

    // Update client KYC status
    await Client.findByIdAndUpdate(userId, {
      kycStatus: 'pending',
      kycSubmission: kyc._id
    });

    return kyc;
  } catch (error) {
    return { error: error.message };
  }
};

const getPendingKYCs = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const kycs = await KYC.find({ status: 'pending' })
      .populate('userId', 'firstname lastname email')
      .skip(skip)
      .limit(limit)
      .sort({ submittedAt: -1 });
    
    const total = await KYC.countDocuments({ status: 'pending' });
    
    return {
      kycs,
      page,
      totalPages: Math.ceil(total / limit),
      total
    };
  } catch (error) {
    return { error: error.message };
  }
};

const getAllKYCs = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const kycs = await KYC.find()
      .populate('userId', 'firstname lastname email')
      .populate('reviewedBy', 'firstname lastname')
      .skip(skip)
      .limit(limit)
      .sort({ submittedAt: -1 });
    
    const total = await KYC.countDocuments();
    
    return {
      kycs,
      page,
      totalPages: Math.ceil(total / limit),
      total
    };
  } catch (error) {
    return { error: error.message };
  }
};

const getKYCById = async (kycId) => {
  try {
    const kyc = await KYC.findById(kycId)
      .populate('userId', 'firstname lastname email phone')
      .populate('reviewedBy', 'firstname lastname');
    
    if (!kyc) {
      return { error: 'KYC not found' };
    }
    
    return kyc;
  } catch (error) {
    return { error: error.message };
  }
};

const approveKYC = async (kycId, adminId, notes = '') => {
  try {
    const kyc = await KYC.findById(kycId);
    if (!kyc) {
      return { error: 'KYC not found' };
    }

    kyc.status = 'approved';
    kyc.adminNotes = notes;
    kyc.reviewedAt = new Date();
    kyc.reviewedBy = adminId;
    await kyc.save();

    // Update client verification status
    await Client.findByIdAndUpdate(kyc.userId, {
      kycStatus: 'approved',
      isVerified: true
    });

    return kyc;
  } catch (error) {
    return { error: error.message };
  }
};

const rejectKYC = async (kycId, adminId, notes) => {
  try {
    const kyc = await KYC.findById(kycId);
    if (!kyc) {
      return { error: 'KYC not found' };
    }

    kyc.status = 'rejected';
    kyc.adminNotes = notes;
    kyc.reviewedAt = new Date();
    kyc.reviewedBy = adminId;
    await kyc.save();

    // Update client KYC status
    await Client.findByIdAndUpdate(kyc.userId, {
      kycStatus: 'rejected',
      isVerified: false
    });

    return kyc;
  } catch (error) {
    return { error: error.message };
  }
};

const getUserKYC = async (userId) => {
  try {
    const kyc = await KYC.findOne({ userId })
      .populate('reviewedBy', 'firstname lastname');
    
    return kyc;
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = {
  submitKYC,
  getPendingKYCs,
  getAllKYCs,
  getKYCById,
  approveKYC,
  rejectKYC,
  getUserKYC
};