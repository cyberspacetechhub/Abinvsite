
const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const verifyRoles = require('../../middlewares/verifyRoles');
const fileUpload = require("express-fileupload");
const filesPayloadExists = require("../../middlewares/filesPayloadExists");
const fileExtLimiter = require("../../middlewares/fileExtLimiter");
const filesSizeLimiter = require("../../middlewares/filiesSizeLimiter");

router.route('/')
    .get(userController.handleGetUSers)
router.route('/upgrade-requests')
    .get(userController.handleGetUpgradeRequests)
router.route('/reqpswdreset')
    .post(userController.requestPswdReset)
router.route('/resetpswd')
    .post(userController.resetPassword)
router.route('/activate/:id')
    .put(userController.handleActivateUser)
router.route('/deactivate/:id')
    .put(userController.handleDeactivateUser)
router.route('/fund/:id')
    .post(userController.handleFundUser)
router.route('/debit/:id')
    .post(userController.handleDebitUser)
router.route('/profile/:id')
    .put(
        fileUpload({ createParentPath: true }),
        filesPayloadExists,
        fileExtLimiter([".png", ".jpg", ".jpeg",".webp"]),
        filesSizeLimiter,
        userController.handleUploadProfilePicture
    )
router.route('/changepswd/:id')
    .put(userController.handleChangePassword)
router.route('/clear-balances/:id') 
    .put(userController.handleClearUserBalances)
router.route('/:id')
    .get(userController.handleGetUser)

module.exports = router