const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.route('/').get(transactionController.handleGetTransactions);
router.route('/user/:id').get(transactionController.handleGetTransactionByUser);
router.route('/:id')
    .get(transactionController.handleGetTransaction)
    .delete(transactionController.handleDeleteTransaction);

module.exports = router;