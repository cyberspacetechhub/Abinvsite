const express = require('express');
const router = express.Router();
const depositController = require('../controllers/depositController');

router.route('/')
    .get(depositController.handleGetDeposits)
    .post(depositController.handleCreateDeposit)
router.route('/status/:id').put(depositController.handleDepositStatus);
router.route('/user/:id').get(depositController.handleGetDepositsByUser);
router.route('/:id')
    .get(depositController.handleGetDeposit)
    .put(depositController.handleDepositStatus);
module.exports = router;