const express = require('express');
const router = express.Router();
const userWithdrawalAccountController = require('../controllers/userWithdrawalAccountController');

router.route('/:userId')
    .get(userWithdrawalAccountController.handleGetUserAccounts)
    .post(userWithdrawalAccountController.handleAddAccount);

router.route('/:userId/:id')
    .delete(userWithdrawalAccountController.handleDeleteAccount);

router.route('/:userId/:id/default')
    .put(userWithdrawalAccountController.handleSetDefault);

module.exports = router;
