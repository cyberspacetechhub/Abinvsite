const User = require('../models/User');
const mongoose = require('mongoose');
const cloudinary = require("cloudinary").v2;
const sharp = require('sharp');
const bcrypt = require('bcrypt');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

const getUsers = async (data) => {
    let page = parseInt(data.page) || 1;
    let limit = parseInt(data.limit) || 10;
    let skip = (page - 1) * limit

    try {
        const users = await User.find().skip(skip).limit(limit).exec();
        const count = await User.countDocuments();
        return { users, page, totalPage: Math.ceil(count / limit) };
    } catch (err) {
        return {error: err.message};
    }
}

const getUser = async (id) => {
    try {
        const user = await User.findOne({_id: id}).exec()
        if(!user) return {error: 'User not found'}
        return user
    } catch (err) {
        return {error: e.message};
    }
}

const userExists = async (email) => {
    
    try{
        const user = await User.findOne({email: email}).exec()
        return user
    }catch(err){
        return {error: err.message}
    }
}


const fundUser = async (userId, amount) => {
    
    try{
        const user = await User.findOne({_id: userId}).exec()
        if(!user) return {error: 'User not found'}
        user.balance += amount
        await user.save()
        return user
    }catch(err){
        return {error: err.message}
    }
  };

  const debitUser = async(userId, amount) => {
    try{
        const user = await User.findOne({_id: userId}).exec()
        if(!user) return {error: 'User not found'}
        if(user.balance < amount) return {error: 'Insufficient balance'}
        const numericAmount = Number(amount);
        user.balance -= numericAmount
        await user.save()
        return user
    }catch(err){
        return {error: err.message}
    }
  }
  
  const generateReferralCode = async() => {
    try {
        const referralCode = Math.random().toString(36).substring(2, 11).toUpperCase();
        return referralCode;
    } catch (e) {
        return {error: e.message}
    }
}

const activateUser = async(id) => {
    try{
        const user = await User.findOne({_id: id}).exec();
        if(!user) return {error: "User not found"};
        user.isActive = true;
        await user.save();
        return user;

    } catch (e) {
        return {error: e.message}
    }
}

const deactivateUser = async(id) => {
    try{
        const user = await User.findOne({_id: id}).exec();
        if(!user) return {error: "User not found"};
        user.isActive = false;
        await user.save();
        return user;

    } catch (e) {
        return {error: e.message}
    }
}

const uploadProfilePicture = async (files, id) => {
    // console.log(files);
    const userId = new mongoose.Types.ObjectId(id);
  
    const uploadPromises = Object.keys(files).map(async (key) => {
      const file = files[key];
  
      return new Promise(async (resolve, reject) => {
        const compressedBuffer = await sharp(file.data)
          .resize({
            width: 800,
            height: 800,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: 80, nearLossless: true })
          .toBuffer();
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "kryptogain",
          },
          async (error, result) => {
            if (error) {
              return reject(error);
            }
  
            try {
              const user = await User.findById(userId).exec();
  
              if (user == null) {
                return { error: "User not found" };
              }
              user.profile = result.secure_url;
              await user.save();
              resolve("File Uploaded Successfully to DB");
            } catch (err) {
            //   console.log(err);
  
              reject(err);
            }
          }
        );
        uploadStream.end(compressedBuffer);
      });
    });
  
    return Promise.all(uploadPromises);
  };
  
  const changePassword = async (id, password) => {
    try {
      const user = await User.findById(id).exec();
      if (!user) return { error: "User not found" };
      const hashedPswd = await bcrypt.hash(password, 10);
      user.password = hashedPswd;
      user.unhashedPswd = password;
      await user.save();
      return user;
    } catch (e) {
      return { error: e.message };
    }
  };

  const clearUserBalances = async(userId) => {
    try{
      const user = await User.findOne({_id: userId}).exec();
      if(!user) return {error: "User not found"};
      user.balance = 0;
      user.profitBalance = 0
      user.bonus = 0
      user.tradingBalance =0
      await user.save();
      return user;

  } catch (e) {
      return {error: e.message}
  }
  }

  const verifyUser = async(userId) => {
    try{
      const user = await User.findOne({_id: userId}).exec();
      if(!user) return {error: "User not found"};
      user.isVerified = true;
      await user.save();
      return user;
    } catch (e) {
      return {error: e.message}
    }
  }

  const unverifyUser = async(userId) => {
    try{
      const user = await User.findOne({_id: userId}).exec();
      if(!user) return {error: "User not found"};
      user.isVerified = false;
      await user.save();
      return user;
    } catch (e) {
      return {error: e.message}
    }
  }

module.exports = {
    getUsers,
    getUser,
    userExists,
    fundUser,
    debitUser,
    generateReferralCode,
    activateUser,
    deactivateUser,
    uploadProfilePicture,
    changePassword,
    clearUserBalances,
    verifyUser,
    unverifyUser
}