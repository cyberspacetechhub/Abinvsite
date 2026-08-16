const express = require('express');
const router = express.Router();
const kycController = require('../controllers/kycController');
const fileUpload = require('express-fileupload');

// Middleware for file uploads
router.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  abortOnLimit: true,
  responseOnLimit: "File size limit exceeded"
}));

// User routes (protected)
router.route('/submit/:userId')
  .post(kycController.handleSubmitKYC);

router.route('/user/:userId')
  .get(kycController.handleGetUserKYC);

// Admin routes (protected)
router.route('/pending')
  .get(kycController.handleGetPendingKYCs);

router.route('/all')
  .get(kycController.handleGetAllKYCs);

router.route('/:kycId')
  .get(kycController.handleGetKYCById);

router.route('/approve/:kycId')
  .put(kycController.handleApproveKYC);

router.route('/reject/:kycId')
  .put(kycController.handleRejectKYC);

module.exports = router;