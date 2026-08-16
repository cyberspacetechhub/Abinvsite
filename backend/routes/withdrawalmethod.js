const express = require('express');
const router = express.Router();
const withdrawalMethodController = require('../controllers/withdrawalMethodController');

router.route('/')
    .get(withdrawalMethodController.handleGetWithdrawalMethods)
    .post(withdrawalMethodController.handleCreateWithdrawalMethod)
    .put(withdrawalMethodController.handleUpdateWithdrawalMethod)
router.route('/:id')
    .get(withdrawalMethodController.handleGetWithdrawalMethod)
    .delete(withdrawalMethodController.handleDeleteWithdrawalMethod);

module.exports = router;