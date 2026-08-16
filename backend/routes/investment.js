const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');

router.route('/')
    .get(investmentController.handleGetInvestments)
    .post(investmentController.handleCreateInvestment)
router.route('/invest-from-balance')
    .post(investmentController.handleInvestFromBalance)
router.route('/upgrade')
    .post(investmentController.handleUpgradePlan)
router.route('/upgrade/approve')
    .post(investmentController.handleApproveUpgrade)
router.route('/upgrade/reject')
    .post(investmentController.handleRejectUpgrade)
router.route('/status/:id').put(investmentController.handleInvestmentStatus)
router.route('/user/:id').get(investmentController.handleGetInvestmentsByUser)
router.route('/:id')
    .get(investmentController.handleGetInvestment)
    .put(investmentController.handleInvestmentStatus)
module.exports = router;