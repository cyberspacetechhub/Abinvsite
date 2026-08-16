const express = require('express');
const router = express.Router();
const depositMethodController = require('../controllers/depositMethodController');

router.route('/')
    .get(depositMethodController.handleGetDepositMethods)
    .post(depositMethodController.handleCreateDepositMethod)
    .put(depositMethodController.handleUpdateDepositMethod)
router.route('/:id')
    .get(depositMethodController.handleGetDepositMethod)
    .delete(depositMethodController.handleDeleteDepositMethod);

module.exports = router;