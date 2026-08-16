const express = require('express');
const router = express.Router();
const withdrawalController = require('../controllers/withdrawalController');

router.route('/')
    .get(withdrawalController.handleGetWithdrawals)
    .post(withdrawalController.handleCreateWithdrawal)

router.route('/status/:id').put(withdrawalController.handleWithdrawalStatus);
router.route('/user/:id').get(withdrawalController.handleGetWithdrawalsByUser);
router.route('/:id')
    .get(withdrawalController.handleGetWithdrawal)
    .put(withdrawalController.handleWithdrawalStatus);

module.exports = router;