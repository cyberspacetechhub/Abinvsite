
const {
    getUsers,
    getUser,
    fundUser,
    debitUser,
    activateUser,
    deactivateUser,
    uploadProfilePicture,
    changePassword,
    clearUserBalances
} = require('../services/userService')
const User = require('../models/User')
const {sendPswdResetEmail} = require('../services/emailService')
const bcrypt = require("bcrypt");
const { generateVerificationToken, verifyToken } = require("../services/tokenService");

const handleGetUSers = async (req, res) => {
    const data = {
        page: req.query.page,
        limit: req.query.limit
    }

    const result = await getUsers(data)
    if(result.error) return res.status(500).send(result.error)
    res.status(200).json(result)
}

const handleGetUser = async (req, res) => {
    if(!req.params.id) return res.status(400).send('id is required')
    const _id = req.params.id
    const result = await getUser(_id)
    if(result.error) return res.status(500).send(result.error)
    res.status(200).json(result)
}

const handleFundUser = async (req, res) => {
    if(!req.params.id) return res.status(400).send('id is required')
    const _id = req.params.id
    const amount = req.body.amount
    const numericAmount = Number(amount);
    const result = await fundUser(_id, numericAmount)
    if(result.error) return res.status(500).send(result.error)
    res.status(200).json(result)
}

const handleDebitUser = async (req, res) => {
    if(!req.params.id) return res.status(400).send('id is required')
    const _id = req.params.id
    const amount = req.body.amount
    const numericAmount = Number(amount);
    const result = await debitUser(_id, numericAmount)
    if(result.error) return res.status(500).send(result.error)
    res.status(200).json(result)
}

const requestPswdReset = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    const token = generateVerificationToken(user._id);
    await sendPswdResetEmail(email, token);
    return res.status(200).json({ message: "Password reset email sent" });
}


const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Verify token
    const decoded = verifyToken(token); // Ensure verifyToken function is working correctly
    if (!decoded) return res.status(400).json({ message: "Invalid or expired token" });

    // Hash the new password
    const salt = await bcrypt.genSalt(10); // Generate a salt
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // Update password in the database
    const user = await User.findOne({ _id: decoded.userId})
    if (!user) return res.status(404).json({ message: "User not found" });
    user.password = hashedPassword;
    user.unhashedPswd = password
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    // console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const handleActivateUser = async (req, res) => {
    if(!req.params.id) return res.status(400).json({error: 'Id is required'})

    const _id = req.params.id
    const result = await activateUser(_id)
    if(result.error) return res.status(400).json({error: result.error})
    return res.status(200).json(result)
}
const handleDeactivateUser = async (req, res) => {
    if(!req.params.id) return res.status(400).json({error: 'Id is required'})

    const _id = req.params.id
    const result = await deactivateUser(_id)
    if(result.error) return res.status(400).json({error: result.error})
    return res.status(200).json(result)
}

const handleUploadProfilePicture = async (req, res) => {
    if(!req.files) {
        return res.status(400).json({ message: 'Profile picture required' });
      }
      const file = req.files;
      const _id = req.params.id
      const result = await uploadProfilePicture(file, _id);
      if(result.error) return res.status(500).json(result);
      res.status(200).json({Success: "Profile picture uploaded successfully", result});
}

const handleChangePassword = async (req, res) => {
    if(!req.params.id) return res.status(400).json({error: 'User Id is required'})
    const _id = req.params.id
    const password = req.body.password
    const result = await changePassword(_id, password)
    if(result.error) return res.status(500).json({error: result.error})
    return res.status(200).json(result)
}

const handleClearUserBalances = async (req, res) => {
    if(!req.params.id) return res.status(400).send('id is required')
    
    const _id = req.params.id
    const result = await clearUserBalances(_id)
    if(result.error) return res.status(400).json({error: result.error})
    return res.status(200).json(result)
}

const handleGetUpgradeRequests = async (req, res) => {
    try {
        const users = await User.find({ planUpgradeAlert: true }).populate('plan').exec();
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    handleGetUSers,
    handleGetUser,
    handleFundUser,
    handleDebitUser,
    requestPswdReset,
    resetPassword,
    handleActivateUser,
    handleDeactivateUser,
    handleUploadProfilePicture,
    handleChangePassword,
    handleClearUserBalances,
    handleGetUpgradeRequests
}