const express = require('express');
const router = express.Router();
const investmentPlanController = require('../controllers/investmentPlanController');

router.route('/')
    .get(investmentPlanController.handleGetInvestmentPlans)
    .post(investmentPlanController.handleCreateInvestmentPlan)
    .put(investmentPlanController.handleUpdateInvestmentPlan)

router.route('/:id')
    .get(investmentPlanController.handleGetInvestmentPlan)
    .delete(investmentPlanController.handleDeleteInvestmentPlan)

module.exports = router;