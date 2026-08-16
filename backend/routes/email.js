

const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController'); 

router.route('/pin')
    .post(emailController.handleSendPin);
router.route('/welcome')
    .post(emailController.handleSendWelcomeMessage);
router.route('/deposit')
    .post(emailController.handleSendDepositMessage);
router.route('/withdrawal')
    .post(emailController.handleSendWithdrawalMessage);
module.exports = router;

