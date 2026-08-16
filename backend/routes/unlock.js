const express = require('express');
const router = express.Router();
const unlockController = require('../controllers/unlockController');
const fileUpload = require('express-fileupload');

router.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 },
  abortOnLimit: true
}));

// User routes
router.route('/request/:userId')
  .post(unlockController.handleSubmitUnlockRequest);

router.route('/forgot-password')
  .post(unlockController.handleForgotPasswordRequest);

router.route('/temp-login')
  .post(unlockController.handleTempLogin);

// Admin routes  
router.route('/requests')
  .get(unlockController.handleGetUnlockRequests);

router.route('/approve/:userId')
  .put(unlockController.handleApproveUnlockRequest);

router.route('/reject/:userId')
  .put(unlockController.handleRejectUnlockRequest);

module.exports = router;