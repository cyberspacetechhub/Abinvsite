const express = require('express');
const router = express.Router();
const withdrawalAuthController = require('../controllers/withdrawalAuthController');

// User routes
router.route('/generate-code/:userId')
  .post(withdrawalAuthController.handleGenerateWithdrawalCode);

router.route('/verify-code/:userId')
  .post(withdrawalAuthController.handleVerifyWithdrawalCode);

// Admin routes
router.route('/enable/:userId')
  .put(withdrawalAuthController.handleEnableWithdrawal);

router.route('/disable/:userId')
  .put(withdrawalAuthController.handleDisableWithdrawal);

module.exports = router;